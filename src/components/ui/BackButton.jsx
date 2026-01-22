import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './Button';

const BackButton = ({
    label = 'Back',
    className,
    variant = 'ghost',
    ...props
}) => {
    const navigate = useNavigate();

    return (
        <Button
            variant={variant}
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className={cn('pl-2', className)}
            {...props}
        >
            {label}
        </Button>
    );
};

export default BackButton;
