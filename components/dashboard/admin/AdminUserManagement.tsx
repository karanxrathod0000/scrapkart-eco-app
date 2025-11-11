import React, { useState, useMemo, useEffect } from 'react';
import notificationService from '../../../services/notificationService';
import * as firebaseService from '../../../services/firebaseService';
import { UserRole } from '../../../types';
import LoadingSpinner from '../../common/LoadingSpinner';

type UserStatus = 'Active' | 'Suspended';

interface User {
    id: string;
    displayName: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: any;
}

const AdminUserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const allUsers = await firebaseService.getAllUsers();
            setUsers(allUsers as User[]);
        } catch (error) {
            notificationService.showToast('Failed to fetch users.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        try {
            const user = users.find(u => u.id === userId);
            if(user) {
                await firebaseService.updateUserRoleAndStatus(userId, newRole, user.status);
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
                notificationService.showToast('User role updated.', 'success');
            }
        } catch(e) {
            notificationService.showToast('Failed to update user role.', 'error');
        }
    };
    
    const handleStatusToggle = async (userId: string) => {
        try {
            const user = users.find(u => u.id === userId);
            if (user) {
                const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
                await firebaseService.updateUserRoleAndStatus(userId, user.role, newStatus);
                setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
                notificationService.showToast('User status updated.', 'info');
            }
        } catch(e) {
            notificationService.showToast('Failed to update user status.', 'error');
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (roleFilter === 'All' || user.role === roleFilter) &&
            (statusFilter === 'All' || user.status === statusFilter)
        );
    }, [users, searchTerm, roleFilter, statusFilter]);
    
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    if (isLoading) {
        return <div className="container"><LoadingSpinner size="large" /></div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>User Management</h1>
                <p>Oversee all user accounts on the platform.</p>
            </div>

            <div className="filters" style={{ justifyContent: 'space-between' }}>
                <input 
                    type="text"
                    className="search-input"
                    style={{width: '300px'}}
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
                <div>
                    <label>Role: </label>
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="user">User</option>
                        <option value="collector">Collector</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                 <div>
                    <label>Status: </label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                 <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <strong>{user.displayName}</strong><br/>
                                    <small>{user.email}</small>
                                </td>
                                <td>
                                    <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}>
                                        <option value="user">User</option>
                                        <option value="collector">Collector</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td><span className={`status-badge status-${user.status || 'Active'}`}>{user.status || 'Active'}</span></td>
                                <td>
                                    <button 
                                        onClick={() => handleStatusToggle(user.id)}
                                        style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: (user.status || 'Active') === 'Active' ? 'var(--error-color)' : 'var(--success-color)'}}
                                    >
                                        {(user.status || 'Active') === 'Active' ? 'Suspend' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagement;