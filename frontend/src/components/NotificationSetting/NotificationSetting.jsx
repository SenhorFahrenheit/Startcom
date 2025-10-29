import "./NotificationSetting.css"

const NotificationSetting = ({title, description, state}) => {
  return (
    <div className="NotificationSetting">
        <div className="notification-title-description">
            <p className="notification-title">{title}</p>
            <p className="notification-description">{description}</p>
        </div>

        <label className="toggle-switch">
            <input type="checkbox" defaultChecked={state} className="toggle-switch-checkbox"/>
            <span className="slider"></span>
        </label>
    </div>
  )
}

export default NotificationSetting