import React from 'react';
import './notificationModal.css';

/**
 * 通用提示弹窗组件
 * 用于显示各种提示信息，如登录提示、操作确认等
 */
const NotificationModal = ({ 
  isOpen, 
  title, 
  message, 
  primaryButtonText = '确定', 
  secondaryButtonText = null, 
  onPrimaryClick, 
  onSecondaryClick, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modalTitle">{title}</h3>}
        <div className="modalMessage">{message}</div>
        <div className="modalActions">
          {secondaryButtonText && (
            <button 
              className="modalSecondaryButton" 
              onClick={onSecondaryClick || onClose}
            >
              {secondaryButtonText}
            </button>
          )}
          <button 
            className="modalPrimaryButton" 
            onClick={onPrimaryClick || onClose}
          >
            {primaryButtonText}
          </button>
        </div>
        <button className="modalCloseButton" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;