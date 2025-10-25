// src/components/ActivityList.jsx
import React from 'react';
import DataTable from 'react-data-table-component';
import styled, { StyleSheetManager } from 'styled-components';
import { Trash2, CheckCircle, XCircle, Edit } from 'lucide-react'; 

// Function to filter out non-standard props that react-data-table-component uses internally.
// We must filter: 'grow', 'allowOverflow', and 'button'.
const shouldForwardProp = (prop) => 
  prop !== 'grow' && prop !== 'allowOverflow' && prop !== 'button'; 

// --- Custom Styles (No Change) ---
const CustomStyles = styled.div`
  .rdt_Table {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  .rdt_TableHeadRow {
    background-color: #f3f4f6; 
    font-weight: 600;
    color: #374151;
  }
  .rdt_TableRow:hover {
    background-color: #f9fafb;
  }
`;
// ---

const ActivityList = ({ activities, onDelete, onUpdateStatus, onView }) => { 
  
  if (!activities || activities.length === 0) {
    return (
      <div className="p-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-lg text-gray-500">No activities logged yet. Start by logging one!</p>
      </div>
    );
  }

  const columns = [
    {
      name: 'Activity',
      selector: row => row.activity_type,
      sortable: true,
      grow: 1.5,
      cell: row => (
        <span className="font-semibold text-indigo-700">{row.activity_type}</span>
      ),
    },
    {
      name: 'Date/Time',
      selector: row => row.date_time,
      sortable: true,
      cell: row => new Date(row.date_time).toLocaleString(),
    },
    {
      name: 'Duration',
      selector: row => row.duration,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          row.status === 'Completed' ? 'bg-green-100 text-green-800' : 
          row.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          {/* View / Edit Button */}
          <button 
            onClick={() => onView(row.id)} 
            className="p-1 text-indigo-500 hover:text-indigo-700 rounded-full hover:bg-indigo-50"
            title="View / Edit Activity"
          >
            <Edit size={18} />
          </button>

          {/* Mark Completed Button */}
          {row.status !== 'Completed' && (
            <button 
              onClick={() => onUpdateStatus(row.id, 'Completed')}
              className="p-1 text-green-500 hover:text-green-700 rounded-full hover:bg-green-50"
              title="Mark Completed"
            >
              <CheckCircle size={18} />
            </button>
          )}
          
          {/* Mark Cancelled Button */}
          {row.status !== 'Cancelled' && (
            <button 
              onClick={() => onUpdateStatus(row.id, 'Cancelled')}
              className="p-1 text-yellow-500 hover:text-yellow-700 rounded-full hover:bg-yellow-50"
              title="Mark Cancelled"
            >
              <XCircle size={18} />
            </button>
          )}

          {/* Delete Button */}
          <button 
            onClick={() => onDelete(row.id)}
            className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true, // This is still here, but now filtered by StyleSheetManager
      button: true,      // This is still here, but now filtered by StyleSheetManager
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-gray-800">Recent Activities</h3>
      <CustomStyles>
        <StyleSheetManager shouldForwardProp={shouldForwardProp}> 
          <DataTable
            columns={columns}
            data={activities}
            pagination
            highlightOnHover
            pointerOnHover
            responsive
            customStyles={{
              table: {
                style: {
                  minHeight: '200px', 
                },
              },
            }}
          />
        </StyleSheetManager>
      </CustomStyles>
    </div>
  );
};

export default ActivityList;