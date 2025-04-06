import React, { useState } from 'react';
import styles from './ContentModeration.module.css';

const ContentModeration = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [content, setContent] = useState([
    {
      id: 1,
      title: "Inappropriate post",
      author: "User123",
      type: "Post",
      date: "2025-03-25",
      flags: 3,
      status: "Flagged",
      reportedReason: "Hate speech"
    },
    {
      id: 2,
      title: "Spam link",
      author: "Spammer99",
      type: "Comment",
      date: "2025-03-26",
      flags: 10,
      status: "Removed",
      reportedReason: "Advertisement"
    }
  ]);

  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    searchQuery: ''
  });

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    // Implement bulk actions logic here
    alert(`Bulk action: ${action} selected for ${selectedItems.length} items`);
  };

  const handleSingleAction = (id, action) => {
    // Implement single item actions logic here
    alert(`Action: ${action} on item ${id}`);
  };

  const filteredContent = content.filter(item => {
    return (
      (filters.type === 'all' || item.type.toLowerCase() === filters.type) &&
      (filters.status === 'all' || item.status.toLowerCase() === filters.status) &&
      (item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
       item.author.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    );
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Content Moderation</h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search content..."
          className={styles.search}
          onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
        />

        <div className={styles.filterGroup}>
          <select 
            className={styles.filter}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="all">All Types</option>
            <option value="post">Posts</option>
            <option value="comment">Comments</option>
            <option value="image">Images</option>
          </select>

          <select 
            className={styles.filter}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Statuses</option>
            <option value="flagged">Flagged</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="removed">Removed</option>
          </select>
        </div>
      </div>

      <div className={styles.bulkActions}>
        <span>{selectedItems.length} selected</span>
        <button 
          className={styles.bulkButton}
          onClick={() => handleBulkAction('approve')}
          disabled={selectedItems.length === 0}
        >
          Approve Selected
        </button>
        <button 
          className={styles.bulkButton}
          onClick={() => handleBulkAction('reject')}
          disabled={selectedItems.length === 0}
        >
          Reject Selected
        </button>
      </div>

      <table className={styles.contentTable}>
        <thead>
          <tr>
            <th></th>
            <th>Content</th>
            <th>Author</th>
            <th>Type</th>
            <th>Date</th>
            <th>Flags</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContent.map(item => (
            <tr key={item.id} className={styles.tableRow}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                />
              </td>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.type}</td>
              <td>{item.date}</td>
              <td>
                <span className={`${styles.flag} ${item.flags > 5 ? styles.highFlags : ''}`}>
                  {item.flags} 🚩
                </span>
              </td>
              <td>
                <span className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>
                  {item.status}
                </span>
              </td>
              <td className={styles.actionButtons}>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleSingleAction(item.id, 'approve')}
                >
                  Approve
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleSingleAction(item.id, 'reject')}
                >
                  Reject
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleSingleAction(item.id, 'edit')}
                >
                  Edit
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.banButton}`}
                  onClick={() => handleSingleAction(item.id, 'ban')}
                >
                  Ban User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.footer}>
        <button className={styles.exportButton}>
          Export Moderation Logs
        </button>
      </div>
    </div>
  );
};

export default ContentModeration;