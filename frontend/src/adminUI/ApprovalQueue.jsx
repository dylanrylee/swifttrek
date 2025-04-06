import React from 'react';

const ApprovalQueue = () => {
  const [requests, setRequests] = useState([
    { id: 1, business: 'Sunny Cars', type: 'Car Rental', date: '2023-05-15' },
    { id: 2, business: 'Luxury Stays', type: 'Accommodation', date: '2023-05-16' },
    { id: 3, business: 'Adventure Tours', type: 'Tour Operator', date: '2023-05-17' }
  ]);

  const handleApprove = (id) => {
    setRequests(requests.filter(req => req.id !== id));
    // In real app, would make API call here
  };

  const handleReject = (id) => {
    setRequests(requests.filter(req => req.id !== id));
    // In real app, would make API call here
  };

  return (
    <div className="approval-queue">
      <h3>Business Approval Requests</h3>
      <table>
        <thead>
          <tr>
            <th>Business</th>
            <th>Type</th>
            <th>Request Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{request.business}</td>
              <td>{request.type}</td>
              <td>{request.date}</td>
              <td>
                <button className="approve-btn" onClick={() => handleApprove(request.id)}>
                  Approve
                </button>
                <button className="reject-btn" onClick={() => handleReject(request.id)}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalQueue;