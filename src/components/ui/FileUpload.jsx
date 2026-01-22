import React, { useRef } from 'react';
import { useField } from 'formik';
import { cn } from '../../lib/utils';
import { Upload, X, FileText } from 'lucide-react';

const FileUpload = ({ label, helperText, className, accept, ...props }) => {
    const [field, meta, helpers] = useField(props);
    const fileInputRef = useRef(null);
    const isError = meta.touched && meta.error;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            helpers.setValue(file);
        }
    };

    const removeFile = (e) => {
        e.stopPropagation();
        helpers.setValue(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={cn('flex flex-col gap-1 w-full', className)}>
            {label && (
                <label className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                </label>
            )}
            <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    'relative flex flex-col items-center justify-center w-full min-h-[100px] border-2 border-dashed rounded-lg cursor-pointer transition-all hover:bg-gray-50',
                    isError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white',
                    field.value ? 'bg-indigo-50 border-indigo-200' : ''
                )}
            >
                <input
                    {...props}
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    className="hidden"
                />

                {field.value ? (
                    <div className="flex items-center gap-3 p-4">
                        <FileText className="h-8 w-8 text-indigo-500" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                {field.value.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {(field.value.size / 1024).toFixed(2)} KB
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="ml-2 p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-4">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                        </p>
                        {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
                    </div>
                )}
            </div>
            {isError && (
                <p className="mt-1 text-xs text-red-600">{meta.error}</p>
            )}
        </div>
    );
};

export default FileUpload;
