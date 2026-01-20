// src/components/MyPage/SectionCard.js
import React from 'react';
import styles from './SectionCard.module.css';

const SectionCard = ({ title, children }) => {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.header}>
                <h6>{title}</h6>
                <i className="bi bi-chevron-right"></i>
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </div>
    );
};

export default SectionCard;