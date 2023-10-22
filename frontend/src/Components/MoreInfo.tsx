import React from 'react';

interface MoreInfoProps {
  onClose: () => void; // Add a callback to close the modal
}

// eslint-disable-next-line react/function-component-definition
const MoreInfo: React.FC<MoreInfoProps> = ({ onClose }) => (
  <dialog id="more-info-dialog" className="modal" open>
    <div className="modal-box">
      <h2 className="text-xl font-varela">More Information</h2>
      <p>This is some additional information about the prediction.</p>
      <p>You can add more details, images, or any other content here.</p>
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  </dialog>
);

export default MoreInfo;
