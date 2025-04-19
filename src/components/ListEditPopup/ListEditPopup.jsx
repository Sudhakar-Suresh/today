import React from "react";
import PropTypes from "prop-types";
import "./ListEditPopup.css";

const ListEditPopup = ({ lists, selectedList, onClose, onEdit }) => {
  const handleListClick = (list) => {
    onEdit(list);
    onClose();
  };

  return (
    <div className="list-popup-overlay" onClick={onClose}>
      <div className="list-popup" onClick={(e) => e.stopPropagation()}>
        <div className="list-popup-header">
          <h3>Move to...</h3>
        </div>
        
        <div className="list-section">
          <div className="list-section-header">
            <span>My lists</span>
            <button className="lock-button">🔒</button>
          </div>
          
          <div className="list-items">
            {lists.map((list, index) => (
              <div 
                key={index}
                className="list-item" 
                onClick={() => handleListClick(list)}
              >
                <span className="list-name">{list}</span>
                {selectedList === list && (
                  <div className="list-checkmark">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

ListEditPopup.propTypes = {
  lists: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedList: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ListEditPopup;