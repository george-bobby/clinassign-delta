import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Search, 
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
import { fetchCaseStudies, fetchPredictionForCaseStudy, updateCaseStudy } from '@/components/case-studies/CaseStudyService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface FormattedCaseStudy {
  id: string;
  title: string;
  description: string;
  status: CaseStudyStatus;
  department: string;
  date: string;
  learning_outcomes: string;
  grade: string | null;
  feedback: string | null;
  student_name?: string;
  student_id?: string;
  prediction_grade?: string | null;
}

const ReviewCasesPage = () => {
  const { toast } = useToast();
  const [caseStudies, setCaseStudies] = useState<FormattedCaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCaseOpen, setViewCaseOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<FormattedCaseStudy | null>(null);
  const [feedback, setFeedback] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const pendingReviewCount = caseStudies.filter(study => study.status === 'submitted').length;
  const reviewedCount = caseStudies.filter(study => study.status === 'reviewed').length;
  const approvedCount = caseStudies.filter(study => study.status === 'approved').length;

  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        setLoading(true);
        const data = await fetchCaseStudies();
        
        const formattedCaseStudies: FormattedCaseStudy[] = await Promise.all(
          data.map(async (cs) => {
            let parsed = { title: '', description: '', department: '', learning_outcomes: '' };
            
            try {
              parsed = JSON.parse(cs.text);
            } catch (e) {
              console.error(`Could not parse case study text for id ${cs.id}`, e);
            }
            
            let prediction = null;
            try {
              prediction = await fetchPredictionForCaseStudy(cs.id);
            } catch (e) {
              console.error(`Error fetching prediction for case study ${cs.id}`, e);
            }
            
            return {
              id: cs.id,
              title: parsed.title || `Case Study ${cs.id.slice(0, 8)}`,
              description: parsed.description || 'No description provided',
              status: (cs.status as CaseStudyStatus) || 'draft',
              department: parsed.department || 'Unknown Department',
              date: new Date(cs.created_at || Date.now()).toISOString().split('T')[0],
              learning_outcomes: parsed.learning_outcomes || 'No learning outcomes provided',
              grade: null,
              feedback: null,
              student_id: cs.student_id,
              student_name: `Student ${cs.student_id?.slice(0, 5) || 'Unknown'}`,
              prediction_grade: prediction?.grade || null
            };
          })
        );
        
        setCaseStudies(formattedCaseStudies);
      } catch (error) {
        console.error("Error loading case studies:", error);
        toast({
          title: "Error",
          description: "Failed to load case studies.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadCaseStudies();
  }, [toast]);
  
  const handleViewCase = (id: string) => {
    const caseStudy = caseStudies.find(c => c.id === id);
    if (caseStudy) {
      setSelectedCase(caseStudy);
      setFeedback(caseStudy.feedback || '');
      setSelectedGrade(caseStudy.grade || caseStudy.prediction_grade || '');
      setViewCaseOpen(true);
    }
  };

  const handleApproveCase = async (id: string, withDialog = false) => {
    try {
      setIsSubmitting(true);
      
      if (withDialog && selectedCase) {
        await updateCaseStudy(id, { 
          status: 'approved',
        });
        
        setCaseStudies(prevStudies => 
          prevStudies.map(study => 
            study.id === id ? { 
              ...study, 
              status: 'approved', 
              grade: selectedGrade,
              feedback
            } : study
          )
        );
      } else {
        await updateCaseStudy(id, { status: 'approved' });
        
        setCaseStudies(prevStudies => 
          prevStudies.map(study => 
            study.id === id ? { ...study, status: 'approved' } : study
          )
        );
      }
      
      toast({
        title: "Case Study Approved",
        description: "The case study has been approved successfully.",
      });
      
      if (withDialog) {
        setViewCaseOpen(false);
      }
    } catch (error) {
      console.error("Error approving case study:", error);
      toast({
        title: "Error",
        description: "Failed to approve the case study.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectCase = async (id: string, withDialog = false) => {
    try {
      setIsSubmitting(true);
      
      if (withDialog && selectedCase) {
        await updateCaseStudy(id, { 
          status: 'reviewed',
        });
        
        setCaseStudies(prevStudies => 
          prevStudies.map(study => 
            study.id === id ? { 
              ...study, 
              status: 'reviewed', 
              grade: 'Needs Revision',
              feedback
            } : study
          )
        );
      } else {
        await updateCaseStudy(id, { status: 'reviewed' });
        
        setCaseStudies(prevStudies => 
          prevStudies.map(study => 
            study.id === id ? { ...study, status: 'reviewed', grade: 'Needs Revision' } : study
          )
        );
      }
      
      toast({
        title: "Case Study Needs Revision",
        description: "The student has been notified that the case study needs revision.",
      });
      
      if (withDialog) {
        setViewCaseOpen(false);
      }
    } catch (error) {
      console.error("Error rejecting case study:", error);
      toast({
        title: "Error",
        description: "Failed to mark the case study for revision.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await fetchCaseStudies();
      
      const formattedCaseStudies: FormattedCaseStudy[] = await Promise.all(
        data.map(async (cs) => {
          let parsed = { title: '', description: '', department: '', learning_outcomes: '' };
          
          try {
            parsed = JSON.parse(cs.text);
          } catch (e) {
            console.error(`Could not parse case study text for id ${cs.id}`, e);
          }
          
          let prediction = null;
          try {
            prediction = await fetchPredictionForCaseStudy(cs.id);
          } catch (e) {
            console.error(`Error fetching prediction for case study ${cs.id}`, e);
          }
          
          return {
            id: cs.id,
            title: parsed.title || `Case Study ${cs.id.slice(0, 8)}`,
            description: parsed.description || 'No description provided',
            status: (cs.status as CaseStudyStatus) || 'draft',
            department: parsed.department || 'Unknown Department',
            date: new Date(cs.created_at || Date.now()).toISOString().split('T')[0],
            learning_outcomes: parsed.learning_outcomes || 'No learning outcomes provided',
            grade: null,
            feedback: null,
            student_id: cs.student_id,
            student_name: `Student ${cs.student_id?.slice(0, 5) || 'Unknown'}`,
            prediction_grade: prediction?.grade || null
          };
        })
      );
      
      setCaseStudies(formattedCaseStudies);
      toast({
        title: "Refreshed",
        description: "Case studies have been refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing case studies:", error);
      toast({
        title: "Error",
        description: "Failed to refresh case studies.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RotateCw size={16} className={loading ? "animate-spin" : ""} />
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
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
            {loading ? (
              <div className="text-center py-8">Loading case studies...</div>
            ) : caseStudies.length === 0 ? (
              <div className="text-center py-8">No case studies found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Predicted Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseStudies.map((caseStudy) => (
                    <TableRow key={caseStudy.id}>
                      <TableCell className="font-medium">{caseStudy.student_name}</TableCell>
                      <TableCell>{caseStudy.title}</TableCell>
                      <TableCell>{caseStudy.department}</TableCell>
                      <TableCell>{caseStudy.date}</TableCell>
                      <TableCell>{getStatusBadge(caseStudy.status)}</TableCell>
                      <TableCell>{caseStudy.prediction_grade || "-"}</TableCell>
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
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={viewCaseOpen} onOpenChange={setViewCaseOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Case Study: {selectedCase?.title}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Status</Label>
                <div className="mt-1">{selectedCase && getStatusBadge(selectedCase.status)}</div>
              </div>

              <div>
                <Label>Student</Label>
                <div className="mt-1 text-sm">{selectedCase?.student_name}</div>
              </div>

              <div>
                <Label>Department</Label>
                <div className="mt-1 text-sm">{selectedCase?.department}</div>
              </div>

              <div>
                <Label>Description</Label>
                <div className="mt-1 text-sm border p-3 rounded-md bg-gray-50">{selectedCase?.description}</div>
              </div>

              <div>
                <Label>Learning Outcomes</Label>
                <div className="mt-1 text-sm border p-3 rounded-md bg-gray-50">{selectedCase?.learning_outcomes}</div>
              </div>

              {selectedCase?.prediction_grade && (
                <div>
                  <Label htmlFor="grade">Predicted Grade</Label>
                  <div className="mt-1">
                    <Badge className="bg-purple-100 text-purple-800">
                      AI Prediction: {selectedCase.prediction_grade}
                    </Badge>
                  </div>
                </div>
              )}

              {selectedCase?.status === 'submitted' && (
                <>
                  <div>
                    <Label htmlFor="grade">Assign Grade</Label>
                    <Select
                      value={selectedGrade}
                      onValueChange={setSelectedGrade}
                    >
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O">Outstanding (O)</SelectItem>
                        <SelectItem value="A">Excellent (A)</SelectItem>
                        <SelectItem value="B">Good (B)</SelectItem>
                        <SelectItem value="C">Average (C)</SelectItem>
                        <SelectItem value="D">Poor (D)</SelectItem>
                        <SelectItem value="F">Fail (F)</SelectItem>
                        <SelectItem value="Needs Revision">Needs Revision</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Provide feedback on this case study"
                      className="min-h-[100px]"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewCaseOpen(false)}
              >
                Close
              </Button>

              {selectedCase?.status === 'submitted' && (
                <>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => handleRejectCase(selectedCase.id, true)}
                    disabled={isSubmitting}
                  >
                    Request Revision
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveCase(selectedCase.id, true)}
                    disabled={isSubmitting || !selectedGrade}
                  >
                    {isSubmitting ? "Processing..." : "Approve with Grade"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ReviewCasesPage;
