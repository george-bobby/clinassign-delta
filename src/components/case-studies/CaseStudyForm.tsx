
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockDepartments } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { submitCaseStudy, updateCaseStudy } from './CaseStudyService';

interface CaseStudyFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: any;
    mode: 'create' | 'edit';
    onSuccess?: () => void;
}

const CaseStudyForm: React.FC<CaseStudyFormProps> = ({
    isOpen,
    onOpenChange,
    initialData,
    mode,
    onSuccess
}) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        department: initialData?.department || '',
        description: initialData?.description || '',
        learning_outcomes: initialData?.learning_outcomes || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, department: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (mode === 'create') {
                await submitCaseStudy(formData);
                toast({
                    title: "Case Study Created",
                    description: "Your new case study has been submitted successfully.",
                });
            } else if (mode === 'edit' && initialData?.id) {
                await updateCaseStudy(initialData.id, formData);
                toast({
                    title: "Case Study Updated",
                    description: "Your case study has been updated successfully.",
                });
            }

            if (onSuccess) {
                onSuccess();
            }
            onOpenChange(false);
        } catch (error) {
            console.error("Error submitting case study:", error);
            toast({
                title: "Error",
                description: "There was an error submitting your case study. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = mode === 'create' ? 'Create New Case Study' : 'Edit Case Study';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter case study title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select 
                            value={formData.department} 
                            onValueChange={handleSelectChange}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockDepartments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the case study in detail"
                            className="min-h-[100px]"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="learning_outcomes">Learning Outcomes</Label>
                        <Textarea
                            id="learning_outcomes"
                            placeholder="What did you learn from this case?"
                            className="min-h-[100px]"
                            value={formData.learning_outcomes}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                            type="submit" 
                            className="bg-clinical-600 hover:bg-clinical-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : mode === 'create' ? 'Submit Case Study' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CaseStudyForm;
