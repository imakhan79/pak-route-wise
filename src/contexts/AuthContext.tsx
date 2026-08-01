
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, AuditLog, ModuleId, PermissionAction } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
    currentUser: User | null;
    users: User[];
    roles: Role[];
    logs: AuditLog[];
    login: (username: string, pass: string) => boolean;
    registerCustomer: (user: Omit<User, 'id' | 'roleId' | 'status' | 'failedLoginAttempts' | 'requiresPasswordChange'>) => boolean;
    /** Syncs a real, confirmed Supabase Auth user into the local session as a Customer. */
    bridgeSupabaseUser: (supabaseUserId: string, email: string, fullName: string, phone?: string, department?: string) => void;
    logout: () => void;
    hasPermission: (module: ModuleId, action: PermissionAction) => boolean;

    // Admin functions
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (id: string, data: Partial<User>) => void;
    deleteUser: (id: string) => void;

    addRole: (role: Omit<Role, 'id'>) => void;
    updateRole: (id: string, data: Partial<Role>) => void;
    deleteRole: (id: string) => void;

    logAction: (action: string, module: ModuleId | 'auth', details: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Mock Data ---

const MOCK_ROLES: Role[] = [
    {
        id: 'role-admin',
        name: 'Administrator',
        description: 'Full system access',
        isSystem: true,
        permissions: {
            dashboard: ['view', 'export'],
            freight_sea: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            freight_air: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            freight_road: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            freight_rail: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            bl_management: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            customs_gd: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            import: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            export: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            cnf: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            transshipment: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            afghan_transit: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            warehousing: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            finance: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            reports: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            settings: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
            tracking: ['view', 'create', 'edit', 'delete', 'export', 'approve', 'lock'],
        }
    },
    {
        id: 'role-manager',
        name: 'Manager',
        description: 'Operations, Approvals, Reports. No Settings.',
        isSystem: true,
        permissions: {
            dashboard: ['view', 'export'],
            freight_sea: ['view', 'create', 'edit', 'approve', 'export'],
            freight_air: ['view', 'create', 'edit', 'approve', 'export'],
            freight_road: ['view', 'create', 'edit', 'approve', 'export'],
            bl_management: ['view', 'create', 'edit', 'approve'],
            customs_gd: ['view', 'create', 'edit', 'approve'],
            import: ['view', 'create', 'edit', 'approve'],
            export: ['view', 'create', 'edit', 'approve'],
            reports: ['view', 'export'],
            tracking: ['view', 'export', 'approve'],
        } as any
    },
    {
        id: 'role-user',
        name: 'Customer',
        description: 'Self-service customer portal - request quotations, book shipments, track cargo, view invoices. No access to the internal operations app.',
        isSystem: true,
        permissions: {} as any
    },
    {
        id: 'role-shipping-agent',
        name: 'Shipping Agent',
        description: 'Books and manages freight shipments and bills of lading on behalf of customers.',
        isSystem: true,
        permissions: {
            dashboard: ['view'],
            freight_sea: ['view', 'create', 'edit'],
            freight_air: ['view', 'create', 'edit'],
            freight_road: ['view', 'create', 'edit'],
            freight_rail: ['view', 'create', 'edit'],
            bl_management: ['view', 'create', 'edit'],
            customs_gd: ['view'],
            import: ['view'],
            export: ['view'],
            reports: ['view'],
            tracking: ['view'],
        } as any
    },
    {
        id: 'role-clearing-agent',
        name: 'Clearing Agent',
        description: 'Handles customs clearance, GD filing, and duty assessment on behalf of importers/exporters.',
        isSystem: true,
        permissions: {
            dashboard: ['view'],
            customs_gd: ['view', 'create', 'edit'],
            import: ['view', 'create', 'edit'],
            export: ['view', 'create', 'edit'],
            cnf: ['view', 'create', 'edit'],
            afghan_transit: ['view'],
            reports: ['view'],
            tracking: ['view'],
        } as any
    },
    {
        id: 'role-carrier',
        name: 'Carrier',
        description: 'Represents a carrier/shipping line, airline, or truck company - manages vessel/flight/truck schedules and transshipment.',
        isSystem: true,
        permissions: {
            dashboard: ['view'],
            freight_sea: ['view', 'edit'],
            bl_management: ['view'],
            cnf: ['view'],
            transshipment: ['view', 'edit'],
            reports: ['view'],
            tracking: ['view', 'edit'],
        } as any
    },
    {
        id: 'role-terminal',
        name: 'Terminal',
        description: 'Manages port/terminal handling, container yard, cargo receiving/dispatch, and customs examination coordination.',
        isSystem: true,
        permissions: {
            dashboard: ['view'],
            warehousing: ['view', 'create', 'edit'],
            customs_gd: ['view', 'edit'],
            afghan_transit: ['view'],
            transshipment: ['view', 'edit'],
            reports: ['view'],
            tracking: ['view'],
        } as any
    }
];

const MOCK_USERS: User[] = [
    {
        id: 'u1',
        fullName: 'System Administrator',
        username: 'admin',
        email: 'admin@logistics.com',
        phone: '+92 300 0000001',
        roleId: 'role-admin',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'Admin@123',
        department: 'IT',
        location: 'HQ',
        avatar: 'https://github.com/shadcn.png'
    },
    {
        id: 'u2',
        fullName: 'Operations Manager',
        username: 'manager',
        email: 'manager@logistics.com',
        phone: '+92 300 0000002',
        roleId: 'role-manager',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'Manager@123',
        department: 'Operations',
        location: 'Karachi Port',
    },
    {
        id: 'u3',
        fullName: 'Nadeem Qureshi',
        username: 'customer',
        email: 'nadeem@alfalahtrading.pk',
        phone: '+92 21 3456 7890',
        roleId: 'role-user',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'Customer@123',
        department: 'Al-Falah Trading Co.',
        location: 'Karachi',
    },
    {
        id: 'u4',
        fullName: 'Shipping Agent',
        username: 'agent',
        email: 'agent@logistics.com',
        phone: '+92 300 0000004',
        roleId: 'role-shipping-agent',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'Agent@123',
        department: 'Shipping',
        location: 'Karachi Office',
    },
    {
        id: 'u7',
        fullName: 'Clearing Agent',
        username: 'clearing',
        email: 'clearing@logistics.com',
        phone: '+92 300 0000007',
        roleId: 'role-clearing-agent',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'Clearing@123',
        department: 'Customs Clearance',
        location: 'Karachi Port',
    },
    {
        id: 'u5',
        fullName: 'Carrier Agent',
        username: 'carrier',
        email: 'carrier@logistics.com',
        phone: '+92 300 0000005',
        roleId: 'role-carrier',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'Carrier@123',
        department: 'Carrier Relations',
        location: 'Karachi Port',
    },
    {
        id: 'u6',
        fullName: 'Terminal Operator',
        username: 'terminal',
        email: 'terminal@logistics.com',
        phone: '+92 300 0000006',
        roleId: 'role-terminal',
        status: 'active',
        failedLoginAttempts: 0,
        requiresPasswordChange: false,
        password: 'Terminal@123',
        department: 'Terminal Operations',
        location: 'Karachi Port',
    }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Start with NO user logged in
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
    const [logs, setLogs] = useState<AuditLog[]>([]);

    const logAction = (action: string, module: ModuleId | 'auth', details: string) => {
        // Allow logging even if no user (for login attempts)
        const userId = currentUser ? currentUser.id : 'system';
        const userName = currentUser ? currentUser.username : 'System/Guest';

        const newLog: AuditLog = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            userName,
            action,
            module,
            details,
            timestamp: new Date()
        };
        setLogs(prev => [newLog, ...prev]);
    };

    const login = (username: string, pass: string) => {
        const user = users.find(u => u.username === username);

        if (!user) {
            logAction('Login Failed', 'auth', `Unknown user: ${username}`);
            return false;
        }

        if (user.status !== 'active') {
            logAction('Login Blocked', 'auth', `Inactive account attempt: ${username}`);
            return false;
        }

        // Simple string comparison for mock. In real app, use bcrypt.compare
        // If the user was just created via UI without explicit password, fallback to 'password' or skip check logic if desired? 
        // For this demo, let's assume all created users get a default if we didn't set one, or stricter check.
        const validPass = user.password === pass;

        if (validPass) {
            setCurrentUser(user);
            logAction('Login Success', 'auth', `User ${username} logged in`);
            return true;
        } else {
            // In a real app we would increment failedLoginAttempts here
            logAction('Login Failed', 'auth', `Invalid password for: ${username}`);
            return false;
        }
    };

    const registerCustomer = (data: Omit<User, 'id' | 'roleId' | 'status' | 'failedLoginAttempts' | 'requiresPasswordChange'>) => {
        if (users.some(u => u.username === data.username)) {
            toast.error('That username is already taken');
            return false;
        }
        const newUser: User = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            roleId: 'role-user',
            status: 'active',
            failedLoginAttempts: 0,
            requiresPasswordChange: false,
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        logAction('Register', 'auth', `New customer registered: ${data.username}`);
        return true;
    };

    const bridgeSupabaseUser = (supabaseUserId: string, email: string, fullName: string, phone?: string, department?: string) => {
        setUsers(prev => {
            const existing = prev.find(u => u.id === supabaseUserId || u.username === email);
            if (existing) {
                setCurrentUser(existing);
                return prev;
            }
            const newUser: User = {
                id: supabaseUserId,
                fullName: fullName || email,
                username: email,
                email,
                phone: phone || '',
                roleId: 'role-user',
                status: 'active',
                failedLoginAttempts: 0,
                requiresPasswordChange: false,
                department,
            };
            setCurrentUser(newUser);
            return [...prev, newUser];
        });
        logAction('Login Success', 'auth', `Confirmed Supabase customer signed in: ${email}`);
    };

    const logout = () => {
        logAction('Logout', 'auth', 'User logged out');
        setCurrentUser(null);
    };

    const hasPermission = (module: ModuleId, action: PermissionAction): boolean => {
        if (!currentUser) return false;
        const role = roles.find(r => r.id === currentUser.roleId);
        if (!role) return false;

        // System admin has clear override? Alternatively just check permissions
        // Permissions might be undefined for some modules in the mock
        const modulePerms = role.permissions[module];
        if (!modulePerms) return false;

        return modulePerms.includes(action);
    };

    // --- CRUD Wrappers ---

    const addUser = (data: Omit<User, 'id'>) => {
        const newUser = { ...data, id: Math.random().toString(36).substr(2, 9) };
        setUsers([...users, newUser]);
        toast.success('User created successfully');
        logAction('Create', 'settings', `Created user ${data.username}`);
    };

    const updateUser = (id: string, data: Partial<User>) => {
        setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
        toast.success('User updated successfully');
        logAction('Edit', 'settings', `Updated user ${id}`);
    };

    const deleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
        toast.success('User deleted successfully');
        logAction('Delete', 'settings', `Deleted user ${id}`);
    };

    const addRole = (data: Omit<Role, 'id'>) => {
        const newRole = { ...data, id: Math.random().toString(36).substr(2, 9) };
        setRoles([...roles, newRole]);
        toast.success('Role created successfully');
        logAction('Create', 'settings', `Created role ${data.name}`);
    };

    const updateRole = (id: string, data: Partial<Role>) => {
        setRoles(roles.map(r => r.id === id ? { ...r, ...data } : r));
        toast.success('Role updated successfully');
        logAction('Edit', 'settings', `Updated role ${id}`);
    };

    const deleteRole = (id: string) => {
        setRoles(roles.filter(r => r.id !== id));
        toast.success('Role deleted successfully');
        logAction('Delete', 'settings', `Deleted role ${id}`);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            users,
            roles,
            logs,
            login,
            registerCustomer,
            bridgeSupabaseUser,
            logout,
            hasPermission,
            addUser,
            updateUser,
            deleteUser,
            addRole,
            updateRole,
            deleteRole,
            logAction
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
