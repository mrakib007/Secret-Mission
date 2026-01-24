import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Radio from '../../components/ui/Radio';
import Select from '../../components/ui/Select';
import Switch from '../../components/ui/Switch';
import ImageUpload from '../../components/ui/ImageUpload';
import Button from '../../components/ui/Button';
import {
    useGetApiQuery,
    usePostFormDataApiMutation,
    useUpdateFormDataPostApiMutation
} from '../../store/api/commonApi';
import { toast } from 'react-toastify';

const userSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    employee_code: Yup.string().required('Employee code is required'),
    password: Yup.string().when('isEditing', {
        is: false,
        then: (schema) => schema.min(6, 'Min 6 characters').required('Password is required'),
        otherwise: (schema) => schema.min(6, 'Min 6 characters'),
    }),
    phone: Yup.string().nullable(),
    gender: Yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender').nullable(),
});

const UserForm = ({ isOpen, onClose, user, onSuccess }) => {
    const isEditing = !!user;

    // Fetch departments and designations
    const { data: deptResponse } = useGetApiQuery({ url: 'open/get-department-list' });
    const { data: desigResponse } = useGetApiQuery({ url: 'open/get-designation-list' });

    const [createUser, { isLoading: isCreating }] = usePostFormDataApiMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateFormDataPostApiMutation();

    const depts = deptResponse?.data?.map(d => ({ label: d.name, value: d.id })) || [];
    const desigs = desigResponse?.data?.map(d => ({ label: d.name, value: d.id })) || [];

    const initialValues = {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || 'male',
        employee_code: user?.employee_code || '',
        hrm_id: user?.hrm_id || '',
        department_id: user?.department_id || '',
        designation_id: user?.designation_id || '',
        wing: user?.wing || 'SFT',
        address: user?.address || '',
        is_active: user?.is_active ?? true,
        profile_picture: null,
        password: '',
        isEditing: isEditing
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const body = { ...values };
            delete body.isEditing;

            // Convert is_active to 1 or 0 for backend
            body.is_active = body.is_active ? 1 : 0;

            if (isEditing && !body.password) {
                delete body.password;
            }

            // Handle file upload correctly - if profile_picture isn't a File, don't send it
            if (!(body.profile_picture instanceof File)) {
                delete body.profile_picture;
            }

            if (isEditing) {
                await updateUser({
                    end_point: `/users/${user.id}`,
                    body: body
                }).unwrap();
                toast.success('User updated successfully');
            } else {
                await createUser({
                    end_point: '/add-new-user',
                    body: body
                }).unwrap();
                toast.success('User created successfully');
            }

            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to save user');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit User' : 'Add New User'}
            size="lg"
        >
            <Formik
                initialValues={initialValues}
                validationSchema={userSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Input label="Full Name *" name="name" placeholder="Tushar Imran" />
                                <Input label="Email Address *" name="email" type="email" placeholder="tushar@bacbonltd.com" disabled={isEditing} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Employee Code *" name="employee_code" placeholder="SFT-EMP-1002" />
                                    <Input label="HRM ID" name="hrm_id" placeholder="HRM-1002" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Select label="Department" name="department_id" options={depts} />
                                    <Select label="Designation" name="designation_id" options={desigs} />
                                </div>
                                <Input label="Phone" name="phone" placeholder="01712345678" />
                            </div>

                            <div className="space-y-4">
                                <ImageUpload label="Profile Picture" name="profile_picture" helperText="Max 2MB" />
                                <Input label={isEditing ? "New Password" : "Password *"} name="password" type="password" placeholder="••••••••" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Wing" name="wing" placeholder="SFT" />
                                    <Switch label="Active Status" name="is_active" className="mt-8" />
                                </div>
                                <Radio
                                    label="Gender"
                                    name="gender"
                                    options={[
                                        { label: 'Male', value: 'male' },
                                        { label: 'Female', value: 'female' },
                                        { label: 'Other', value: 'other' },
                                    ]}
                                />
                            </div>
                        </div>

                        <Input label="Address" name="address" placeholder="House-13, Block-C, Banasree, Dhaka" />

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                            <Button type="submit" isLoading={isSubmitting || isCreating || isUpdating}>
                                {isEditing ? 'Update User' : 'Create User'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default UserForm;
