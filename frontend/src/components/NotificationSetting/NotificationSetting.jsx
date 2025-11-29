import "./NotificationSetting.css";

/**
 * Renders a notification setting with title, description, and toggle switch
 */
const NotificationSetting = ({ title, description, state }) => {
  return (
    <div className="NotificationSetting">
      {/* Notification text content */}
      <div className="notification-title-description">
        <p className="notification-title">{title}</p>
        <p className="notification-description">{description}</p>
      </div>

      {/* Toggle switch control */}
      <label className="toggle-switch">
        <input
          type="checkbox"
          defaultChecked={state}
          className="toggle-switch-checkbox"
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default NotificationSetting;
