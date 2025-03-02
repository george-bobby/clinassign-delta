
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockCaseStudies } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Search, 
  AlertCircle, 
  RotateCw,
  Eye,
  CheckCheck,
  XCircle
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { CaseStudy, CaseStudyStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const getStatusBadge = (status: CaseStudyStatus) => {
  switch (status) {
    case 'submitted':
      return <Badge className="bg-blue-500">{status}</Badge>;
    case 'reviewed':
      return <Badge className="bg-orange-500">{status}</Badge>;
    case 'approved':
      return <Badge className="bg-green-500">{status}</Badge>;
    case 'draft':
      return <Badge className="bg-gray-400">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const ReviewCasesPage = () => {
  const { toast } = useToast();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(mockCaseStudies);
  
  const pendingReviewCount = caseStudies.filter(study => study.status === 'submitted').length;
  const reviewedCount = caseStudies.filter(study => study.status === 'reviewed').length;
  const approvedCount = caseStudies.filter(study => study.status === 'approved').length;
  
  const handleViewCase = (id: string) => {
    toast({
      title: 'View Case Study',
      description: 'Opening case study details view...',
    });
  };

  const handleApproveCase = (id: string) => {
    setCaseStudies(caseStudies.map(study => 
      study.id === id ? { ...study, status: 'approved', grade: study.grade || 'A-' } : study
    ));
    
    toast({
      title: 'Case Study Approved',
      description: 'The case study has been approved successfully.',
    });
  };

  const handleRejectCase = (id: string) => {
    setCaseStudies(caseStudies.map(study => 
      study.id === id ? { ...study, status: 'reviewed', grade: 'Needs Revision' } : study
    ));
    
    toast({
      title: 'Case Study Needs Revision',
      description: 'The student has been notified that the case study needs revision.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Review Case Studies</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Search size={16} />
              <span>Search</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RotateCw size={16} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviewCount}</div>
              <p className="text-xs text-gray-500 mt-1">Case studies waiting for review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4 text-orange-500" />
                Reviewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewedCount}</div>
              <p className="text-xs text-gray-500 mt-1">Reviewed but not yet approved</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-gray-500 mt-1">Successfully approved case studies</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Case Studies</CardTitle>
            <CardDescription>Review and approve student case studies</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseStudies.map((caseStudy) => (
                  <TableRow key={caseStudy.id}>
                    <TableCell className="font-medium">{caseStudy.student?.name}</TableCell>
                    <TableCell>{caseStudy.title}</TableCell>
                    <TableCell>{caseStudy.department?.name || "Unknown Department"}</TableCell>
                    <TableCell>{caseStudy.date}</TableCell>
                    <TableCell>{getStatusBadge(caseStudy.status)}</TableCell>
                    <TableCell>{caseStudy.grade || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewCase(caseStudy.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {caseStudy.status === 'submitted' && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-500" onClick={() => handleApproveCase(caseStudy.id)}>
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleRejectCase(caseStudy.id)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReviewCasesPage;
