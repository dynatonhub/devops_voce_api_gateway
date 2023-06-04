import { PrismaClient } from '@prisma/client';
import * as roles from './data/roles.json';
import * as permissions from './data/permissions.json';
import * as groups from './data/groups.json';
import slugify from 'slugify';
const prisma = new PrismaClient();
async function main() {
  const roleSuperAdmin = '5ca9bccc-bcdb-41f3-9599-e65a0a082e83';
  const roleAdmin = '422f6159-c943-4131-ba28-7637cb7ed0a7';
  const groupFinanceiro = '11bd850a-2d73-4d60-841c-cf6b5207c928';
  const userId = '23b88f67-28c9-463e-9d6a-3095820b1070';
  console.log('Start seeding...');
  await prisma.userOnGroup.deleteMany();
  await prisma.userOnPermission.deleteMany();
  await prisma.roleOnPermission.deleteMany();
  await prisma.groupOnPermission.deleteMany();
  await prisma.session.deleteMany();
  await prisma.group.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  console.log('All delete...');
  await prisma.group.createMany({ data: groups });
  console.log('Groups created...');
  await prisma.role.createMany({ data: roles });
  console.log('Roles created...');
  await prisma.permission.createMany({
    data: permissions.map(permission => ({ ...permission, slug: slugify(permission.name, { lower: true }) })),
  });
  console.log('Permissions created...');
  const permissionsCreated = await prisma.permission.findMany();
  const adminRolePermissions = permissionsCreated.filter(
    permission => permission.entity === 'user' || permission.entity === 'group',
  );
  const financialGroupPermissions = permissionsCreated.filter(
    permission => permission.entity === 'credit' || permission.entity === 'transaction',
  );
  await prisma.roleOnPermission.createMany({
    data: permissionsCreated.map(permission => ({
      role_id: roleSuperAdmin,
      permission_id: permission.id,
    })),
  });
  console.log('Role super admin created...');
  await prisma.roleOnPermission.createMany({
    data: adminRolePermissions.map(permission => ({
      role_id: roleAdmin,
      permission_id: permission.id,
    })),
  });
  console.log('Role admin created...');
  await prisma.groupOnPermission.createMany({
    data: financialGroupPermissions.map(permission => ({
      group_id: groupFinanceiro,
      permission_id: permission.id,
    })),
  });
  console.log('Group financeiro created...');
  await prisma.userOnGroup.create({
    data: {
      group_id: groupFinanceiro,
      user_id: userId,
    },
  });
  console.log('User on group financeiro created...');
}

main()
  .then(async () => {
    console.log('Seeding completed');
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
