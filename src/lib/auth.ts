import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';
import { ROLES } from './constants';

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }

  return user;
}

export function canAccess(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = [
    ROLES.SUPER_ADMIN,
    ROLES.ADMIN,
    ROLES.DISTRIBUTOR,
    ROLES.VIEWER,
  ];

  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

  return userRoleIndex <= requiredRoleIndex;
}
