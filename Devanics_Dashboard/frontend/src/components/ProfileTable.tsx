import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, deleteProfile, archiveProfile, fetchProfilesAsync } from '../redux/profileSlice';
import { RootState, AppDispatch } from '../redux/store';
import axios from 'axios';

interface ProfileTableProps {
  onEdit: (profile: any) => void;
}

const ProfileTable: React.FC<ProfileTableProps> = ({ onEdit }) => {
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector((state: RootState) => state.profiles);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    dispatch(fetchProfilesAsync()).then(() => {
      console.log('Fetched profiles:', profiles);
      setRefresh(prev => !prev); // Trigger re-render
    });
  }, [dispatch]);

  const handleStatusChange = (id: string, status: string) => {
    const validStatus = status as 'In Progress' | 'Draft' | 'Completed';
    if (['In Progress', 'Draft', 'Completed'].includes(status)) {
      dispatch(updateProfile({ id, changes: { status: validStatus } }));
      axios.put(`http://localhost:3001/api/profiles/${id}`, { status: validStatus });
    }
  };

  const handleArchive = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      dispatch(archiveProfile(id));
      axios.put(`http://localhost:3001/api/profiles/${id}`, { archived: !profile.archived });
    }
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#fff' }}>
          <th>ID</th>
          <th>Company Name</th>
          <th>Logo</th>
          <th>No of hires/year</th>
          <th>Start Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <tr key={profile.id} style={{ background: '#fff' }}>
              <td>{profile.id}</td>
              <td>{profile.companyName}</td>
              {/* <td>{profile.logo ? <img src={profile.logo} alt="Logo" width="50" /> : 'No Logo'}</td> */}
              <td>{profile.hiresPerYear}</td>
              <td>{profile.startDate}</td>
              <td>
                <select value={profile.status} onChange={(e) => handleStatusChange(profile.id, e.target.value)}>
                  <option value="In Progress">In Progress</option>
                  <option value="Draft">Draft</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                <button onClick={() => onEdit(profile)}>Edit</button>
                <button onClick={() => { dispatch(deleteProfile(profile.id)); axios.delete(`http://localhost:3001/api/profiles/${profile.id}`); }}>Delete</button>
                <button onClick={() => handleArchive(profile.id)}>
                  {profile.archived ? 'Unarchive' : 'Archive'}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7}>No profiles available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ProfileTable;