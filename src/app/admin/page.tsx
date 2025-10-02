import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BioForm } from '@/components/admin/bio-form';
import { ProjectsAdmin } from '@/components/admin/projects-admin';
import { ResumeAdmin } from '@/components/admin/resume-admin';
import { MessagesTable } from '@/components/admin/messages-table';
import { UsersAdmin } from '@/components/admin/users-admin';
import { User, MessageSquare, Briefcase, FolderKanban, Users } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <Tabs defaultValue="bio">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="bio"><User className="mr-2 h-4 w-4" />Bio</TabsTrigger>
        <TabsTrigger value="projects"><FolderKanban className="mr-2 h-4 w-4" />Projects</TabsTrigger>
        <TabsTrigger value="resume"><Briefcase className="mr-2 h-4 w-4" />Resume</TabsTrigger>
        <TabsTrigger value="messages"><MessageSquare className="mr-2 h-4 w-4" />Messages</TabsTrigger>
        <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Users</TabsTrigger>
      </TabsList>
      <TabsContent value="bio" className="mt-6">
        <BioForm />
      </TabsContent>
      <TabsContent value="projects" className="mt-6 space-y-6">
        <ProjectsAdmin />
      </TabsContent>
      <TabsContent value="resume" className="mt-6">
        <ResumeAdmin />
      </TabsContent>
      <TabsContent value="messages" className="mt-6">
        <MessagesTable />
      </TabsContent>
      <TabsContent value="users" className="mt-6">
        <UsersAdmin />
      </TabsContent>
    </Tabs>
  );
}
