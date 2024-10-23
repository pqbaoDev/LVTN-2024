/* eslint-disable react/prop-types */
/* ConfirmationModal.js */

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-5 w-96">
                <h2 className="text-lg font-semibold mb-4">{message}</h2>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-primaryColor text-white px-4 py-2 rounded-lg"
                    >
                        Xác Nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
