import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Shield, 
  Settings, 
  Mail,
  Phone,
  MapPin,
  Crown,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockTeams = [
  {
    id: 1,
    name: 'Platform Engineering',
    description: 'Core infrastructure and webhook gateway management',
    memberCount: 8,
    role: 'admin',
    created: '2024-01-15'
  },
  {
    id: 2,
    name: 'Product Team',
    description: 'Product development and feature planning',
    memberCount: 12,
    role: 'developer',
    created: '2024-01-20'
  },
  {
    id: 3,
    name: 'Security Team',
    description: 'Security monitoring and compliance',
    memberCount: 4,
    role: 'security',
    created: '2024-02-01'
  }
];

const mockMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    role: 'admin',
    team: 'Platform Engineering',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100',
    lastActive: '2 minutes ago',
    status: 'active'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    email: 'marcus@company.com',
    role: 'developer',
    team: 'Product Team',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    lastActive: '1 hour ago',
    status: 'active'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    email: 'elena@company.com',
    role: 'security',
    team: 'Security Team',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    lastActive: '3 hours ago',
    status: 'active'
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david@company.com',
    role: 'viewer',
    team: 'Product Team',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    lastActive: '1 day ago',
    status: 'inactive'
  }
];

const roleColors = {
  admin: 'bg-red-500',
  developer: 'bg-blue-500',
  security: 'bg-purple-500',
  viewer: 'bg-gray-500'
};

export default function Teams() {
  const [isInviting, setIsInviting] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  const TeamCard = ({ team }: { team: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <Badge variant="outline" className={`text-white ${roleColors[team.role as keyof typeof roleColors]}`}>
                  {team.role}
                </Badge>
              </div>
              <CardDescription>{team.description}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Team
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Permissions
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {team.memberCount} members
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Created {team.created}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Manage Members
            </Button>
            <Button size="sm" className="flex-1">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const MemberCard = ({ member }: { member: any }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{member.name}</h4>
                <Badge 
                  variant="outline" 
                  className={`text-white text-xs ${roleColors[member.role as keyof typeof roleColors]}`}
                >
                  {member.role}
                </Badge>
                {member.role === 'admin' && <Crown className="w-3 h-3 text-yellow-500" />}
              </div>
              <p className="text-sm text-muted-foreground">{member.email}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>{member.team}</span>
                <span>•</span>
                <span>Last active: {member.lastActive}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
              {member.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Role
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                {member.status === 'active' ? (
                  <DropdownMenuItem>
                    <UserX className="w-4 h-4 mr-2" />
                    Deactivate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Activate
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teams & Access</h1>
          <p className="text-muted-foreground">Manage team members, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isInviting} onOpenChange={setIsInviting}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Invite Members
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Team Members</DialogTitle>
                <DialogDescription>
                  Send invitations to new team members
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Addresses</Label>
                  <Input placeholder="user@company.com, user2@company.com..." />
                </div>
                <div className="space-y-2">
                  <Label>Default Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Send Invites</Button>
                  <Button variant="outline" onClick={() => setIsInviting(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreatingTeam} onOpenChange={setIsCreatingTeam}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Set up a new team with specific permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Team Name</Label>
                  <Input placeholder="Enter team name..." />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Team description..." />
                </div>
                <div className="space-y-2">
                  <Label>Default Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Create Team</Button>
                  <Button variant="outline" onClick={() => setIsCreatingTeam(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockMembers.length}</p>
                <p className="text-xs text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-info" />
              <div>
                <p className="text-2xl font-bold">{mockTeams.length}</p>
                <p className="text-xs text-muted-foreground">Active Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Admin Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Active Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">All Members</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          {mockMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>
                  Default permissions for each role level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="font-medium">Admin</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Full access</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="font-medium">Developer</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Read/Write</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full" />
                      <span className="font-medium">Viewer</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Read only</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Controls</CardTitle>
                <CardDescription>
                  Configure system-wide access policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Multi-factor Authentication</span>
                    <Badge variant="default">Required</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSO Integration</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Key Access</span>
                    <Badge variant="default">Restricted</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Timeout</span>
                    <Badge variant="outline">8 hours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}