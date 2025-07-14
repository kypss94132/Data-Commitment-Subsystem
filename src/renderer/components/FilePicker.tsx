import React from 'react';

interface FilePickerProps {
    onFileSelect: (fileName: string, filePath: string) => void; // Send both fileName and filePath
}

const FilePicker: React.FC<FilePickerProps> = ({ onFileSelect }) => {
    const openFileDialog = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.g4'; // Restrict to .g4 files only

        // Use a standard event listener to capture the selected file
        input.addEventListener('change', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                onFileSelect(file.name, file.path); // Send both file name and file path
            }
        });

        input.click();
    };

    return (
        <button onClick={openFileDialog} className="right-button">
            Open .g4 file path
        </button>
    );
};

export default FilePicker;