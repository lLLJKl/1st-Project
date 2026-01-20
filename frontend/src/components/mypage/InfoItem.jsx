// src/components/MyPage/InfoItem.js
import React from 'react';
import styles from './InfoItem.module.css';

const InfoItem = ({ icon, title, content, actionType }) => {
    return (
        <div className={styles.itemContainer}>
            <div className={styles.leftSection}>
                <i className={`bi bi-${icon} ${styles.icon}`}></i>
                <span className={styles.title}>{title}</span>
                {content && <span className={styles.content}>{content}</span>}
            </div>
            
            <div className={styles.rightSection}>
                {actionType === 'button' && (
                    <button className={styles.editBtn}>수정</button>
                )}
                {actionType === 'switch' && (
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" defaultChecked />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoItem;