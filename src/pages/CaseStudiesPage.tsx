
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Book, FileText, Clock, CheckCircle, Edit, Plus, User, Calendar, Hospital } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CaseStudyStatus } from '@/lib/types';
import CaseStudyForm from '../components/case-studies/CaseStudyForm';
import { fetchCaseStudies, fetchPredictionForCaseStudy, updateCaseStudy } from '@/components/case-studies/CaseStudyService';

// Mock case studies data for fallback
const mockCaseStudies = [
    {
        id: '1',
        title: 'Respiratory Assessment in COPD Patient',
        description: 'Comprehensive assessment of a 65-year-old male with COPD exacerbation, including physical examination, diagnostic interpretation, and treatment planning.',
        status: 'approved' as CaseStudyStatus,
        department: 'Emergency Care',
        date: '2023-10-05',
        learning_outcomes: 'Understanding respiratory assessment techniques, interpretation of arterial blood gases, and management of COPD exacerbations.',
        grade: 'A',
        feedback: 'Excellent work on the assessment framework and diagnostic interpretation. Your treatment plan was well-structured and evidence-based.',
    },
    {
        id: '2',
        title: 'Post-Operative Wound Care Protocol',
        description: 'Implementation of wound care protocol for a patient following abdominal surgery, including assessment, dressing changes, and infection prevention.',
        status: 'submitted' as CaseStudyStatus,
        department: 'Surgery',
        date: '2023-10-12',
        learning_outcomes: 'Proper wound assessment, sterile technique for dressing changes, and early identification of wound complications.',
        grade: null,
        feedback: null,
    },
    {
        id: '3',
        title: 'Pediatric Fever Management',
        description: 'Management of a 3-year-old patient presenting with high fever, including assessment, differential diagnosis, and family education.',
        status: 'draft' as CaseStudyStatus,
        department: 'Pediatrics',
        date: '2023-10-15',
        learning_outcomes: 'Pediatric assessment techniques, age-appropriate fever management, and family education strategies.',
        grade: null,
        feedback: null,
    },
    {
        id: '4',
        title: 'Diabetes Management in Elderly Patient',
        description: 'Comprehensive care plan for an 82-year-old patient with poorly controlled type 2 diabetes, including medication management and lifestyle modifications.',
        status: 'reviewed' as CaseStudyStatus,
        department: 'Oncology',
        date: '2023-09-28',
        learning_outcomes: 'Geriatric assessment, management of diabetes in elderly patients, and considerations for polypharmacy.',
        grade: 'B+',
        feedback: 'Good assessment and medication management plan. Consider incorporating more details on nutritional recommendations for elderly patients with diabetes.',
    }
];

const statusColors = {
    draft: 'bg-gray-200 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800'
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
    student_id?: string;
}

const CaseStudiesPage = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('all');
    const [selectedCase, setSelectedCase] = useState<FormattedCaseStudy | null>(null);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [editData, setEditData] = useState<any>(null);
    const [caseStudies, setCaseStudies] = useState<FormattedCaseStudy[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch case studies from Supabase
    useEffect(() => {
        const loadCaseStudies = async () => {
            try {
                setLoading(true);
                const data = await fetchCaseStudies();
                
                // Format the case studies
                const formattedCaseStudies: FormattedCaseStudy[] = await Promise.all(
                    data.map(async (cs) => {
                        let parsed = { title: '', description: '', department: '', learning_outcomes: '' };
                        
                        try {
                            parsed = JSON.parse(cs.text);
                        } catch (e) {
                            console.error(`Could not parse case study text for id ${cs.id}`, e);
                        }
                        
                        // Try to fetch prediction for this case study
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
                            grade: prediction?.grade || null,
                            feedback: null, // We don't have feedback in the database yet
                            student_id: cs.student_id
                        };
                    })
                );
                
                setCaseStudies(formattedCaseStudies);
            } catch (error) {
                console.error("Error loading case studies:", error);
                toast({
                    title: "Error",
                    description: "Failed to load case studies. Using mock data instead.",
                    variant: "destructive"
                });
                // Fall back to mock data
                setCaseStudies(mockCaseStudies);
            } finally {
                setLoading(false);
            }
        };
        
        loadCaseStudies();
    }, [toast]);

    const filteredCaseStudies = activeTab === 'all'
        ? caseStudies
        : caseStudies.filter(study => study.status === activeTab);

    const counts = {
        all: caseStudies.length,
        draft: caseStudies.filter(study => study.status === 'draft').length,
        submitted: caseStudies.filter(study => study.status === 'submitted').length,
        reviewed: caseStudies.filter(study => study.status === 'reviewed').length,
        approved: caseStudies.filter(study => study.status === 'approved').length
    };

    const handleViewDetails = (caseStudy: FormattedCaseStudy) => {
        setSelectedCase(caseStudy);
        setViewDetailsOpen(true);
    };

    const handleCreateNew = () => {
        setFormMode('create');
        setEditData(null);
        setFormOpen(true);
    };

    const handleEditCaseStudy = (id: string) => {
        const caseToEdit = caseStudies.find(cs => cs.id === id);
        setFormMode('edit');
        setEditData(caseToEdit);
        setFormOpen(true);
    };

    const handleSubmitCaseStudy = async (id: string) => {
        try {
            await updateCaseStudy(id, { status: 'submitted' });
            
            // Update the local state
            setCaseStudies(prev => 
                prev.map(cs => cs.id === id ? { ...cs, status: 'submitted' as CaseStudyStatus } : cs)
            );
            
            toast({
                title: "Case Study Submitted",
                description: "Your case study has been submitted for review.",
            });
        } catch (error) {
            console.error("Error submitting case study:", error);
            toast({
                title: "Error",
                description: "Failed to submit case study. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleCaseStudySuccess = async () => {
        // Refetch case studies to get the updated list
        try {
            const data = await fetchCaseStudies();
            
            // Format the case studies (same logic as in useEffect)
            const formattedCaseStudies: FormattedCaseStudy[] = await Promise.all(
                data.map(async (cs) => {
                    let parsed = { title: '', description: '', department: '', learning_outcomes: '' };
                    
                    try {
                        parsed = JSON.parse(cs.text);
                    } catch (e) {
                        console.error(`Could not parse case study text for id ${cs.id}`, e);
                    }
                    
                    // Try to fetch prediction for this case study
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
                        grade: prediction?.grade || null,
                        feedback: null,
                        student_id: cs.student_id
                    };
                })
            );
            
            setCaseStudies(formattedCaseStudies);
        } catch (error) {
            console.error("Error reloading case studies:", error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Case Studies</h1>
                        <p className="text-gray-500 mt-1">Manage and submit your clinical case studies</p>
                    </div>
                    <Button onClick={handleCreateNew} className="bg-clinical-600 hover:bg-clinical-700">
                        <Plus className="mr-2 h-4 w-4" /> New Case Study
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                <FileText className="mr-2 h-4 w-4 text-gray-500" />
                                All Case Studies
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.all}</div>
                            <p className="text-xs text-gray-500 mt-1">Total case studies</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                <Edit className="mr-2 h-4 w-4 text-gray-500" />
                                Draft
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.draft}</div>
                            <p className="text-xs text-gray-500 mt-1">Drafts in progress</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                Submitted
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{counts.submitted}</div>
                            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
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
                            <div className="text-2xl font-bold">{counts.approved}</div>
                            <p className="text-xs text-gray-500 mt-1">Successfully completed</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                        <TabsTrigger value="draft">Drafts ({counts.draft})</TabsTrigger>
                        <TabsTrigger value="submitted">Submitted ({counts.submitted})</TabsTrigger>
                        <TabsTrigger value="reviewed">Reviewed ({counts.reviewed})</TabsTrigger>
                        <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-6">
                        {loading ? (
                            <div className="text-center py-8">Loading case studies...</div>
                        ) : filteredCaseStudies.length === 0 ? (
                            <div className="text-center py-8">No case studies found</div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {filteredCaseStudies.map((caseStudy) => (
                                    <Card key={caseStudy.id} className="animate-fade-in">
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{caseStudy.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Hospital className="h-3 w-3 text-gray-400" />
                                                        <p className="text-sm text-gray-600">{caseStudy.department}</p>
                                                    </div>
                                                </div>
                                                <Badge className={statusColors[caseStudy.status]}>
                                                    {caseStudy.status.charAt(0).toUpperCase() + caseStudy.status.slice(1)}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                                                {caseStudy.description}
                                            </p>

                                            <div className="flex items-center text-xs text-gray-500 mt-4">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                <span>Created on {caseStudy.date}</span>
                                            </div>

                                            {caseStudy.grade && (
                                                <div className="mt-4 mb-4">
                                                    <span className="px-2 py-1 bg-clinical-100 text-clinical-800 rounded-full text-xs font-medium">
                                                        Grade: {caseStudy.grade}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(caseStudy)}
                                                >
                                                    View Details
                                                </Button>

                                                {caseStudy.status === 'draft' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditCaseStudy(caseStudy.id)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="bg-clinical-600 hover:bg-clinical-700"
                                                            onClick={() => handleSubmitCaseStudy(caseStudy.id)}
                                                        >
                                                            Submit
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedCase?.title}</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Badge className={selectedCase?.status ? statusColors[selectedCase.status] : ''}>
                                {selectedCase?.status ? selectedCase.status.charAt(0).toUpperCase() + selectedCase.status.slice(1) : ''}
                            </Badge>
                            <div className="text-sm text-gray-500">
                                {selectedCase?.date}
                            </div>
                        </div>

                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-2">
                                <Hospital className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">Department:</span> {selectedCase?.department}
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-1">Description</h4>
                                <p className="text-sm">{selectedCase?.description}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-1">Learning Outcomes</h4>
                                <p className="text-sm">{selectedCase?.learning_outcomes}</p>
                            </div>

                            {selectedCase?.grade && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Grade</h4>
                                    <div className="px-2 py-1 bg-clinical-100 text-clinical-800 rounded-full text-xs font-medium inline-block">
                                        {selectedCase.grade}
                                    </div>
                                </div>
                            )}

                            {selectedCase?.feedback && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Feedback</h4>
                                    <p className="text-sm">{selectedCase.feedback}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setViewDetailsOpen(false)}
                            >
                                Close
                            </Button>

                            {selectedCase?.status === 'draft' && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            handleEditCaseStudy(selectedCase.id);
                                            setViewDetailsOpen(false);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className="bg-clinical-600 hover:bg-clinical-700"
                                        onClick={() => {
                                            handleSubmitCaseStudy(selectedCase.id);
                                            setViewDetailsOpen(false);
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <CaseStudyForm
                isOpen={formOpen}
                onOpenChange={setFormOpen}
                initialData={editData}
                mode={formMode}
                onSuccess={handleCaseStudySuccess}
            />
        </Layout>
    );
};

export default CaseStudiesPage;
