import React from 'react';

const StatCard = ({ title, value }) => (
  <div className="col-md-3 mb-3">
    <div className="card text-center shadow-sm">
      <div className="card-body">
        <h6 className="text-muted">{title}</h6>
        <h4 className="fw-bold text-primary">{value}</h4>
      </div>
    </div>
  </div>
);

export default StatCard;
