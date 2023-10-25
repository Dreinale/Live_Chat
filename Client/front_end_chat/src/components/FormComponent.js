import React from 'react';

const FormField = ({ label, type, name, value, onChange }) => (
    <div>
        <label>{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} />
    </div>
);

const Form = ({ onSubmit, children }) => (
    <form onSubmit={onSubmit}>
        {children}
    </form>
);

export { Form, FormField };
