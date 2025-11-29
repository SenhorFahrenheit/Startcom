import Modal from "react-modal";
import BackButton from "../BackButton/BackButton";
import "./Modals.css";

/**
 * BaseModal component
 *
 * A reusable modal wrapper based on react-modal.
 * Provides consistent styling, optional back button, and custom dimensions.
 *
 * Props:
 * - isOpen: boolean, controls modal visibility
 * - onClose: function, callback to close the modal
 * - children: React node, modal content
 * - contentLabel: string, accessibility label for screen readers
 * - width: string, modal width (default: "90%")
 * - height: string, modal height (default: "auto")
 * - className: string, additional CSS class names
 * - showCloseButton: boolean, whether to show the BackButton for closing (default: true)
 */
const BaseModal = ({
  isOpen,
  onClose,
  children,
  contentLabel,
  width = "90%",
  height = "auto",
  className = "",
  showCloseButton = true,
}) => {
  return (
    <Modal
      isOpen={isOpen} // Control modal visibility
      onRequestClose={onClose} // Close modal when clicking overlay or pressing ESC
      contentLabel={contentLabel} // Accessibility label
      overlayClassName="modal-overlay" // CSS class for the overlay
      className={`modal-content ${className}`} // Base content class + custom classes
      closeTimeoutMS={300} // Animation delay on close
      style={{
        content: { width, height, margin: "auto" }, // Center modal and apply custom dimensions
      }}
    >
      {/* Optional BackButton for closing the modal */}
      {showCloseButton && <><BackButton color="var(--primary-color)" onClick={onClose} /> <br/></>}
      {/* Render modal children */}
      {children}
    </Modal>
  );
};

export default BaseModal;
