
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockDepartments } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CaseStudyFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  mode: 'create' | 'edit';
}

const CaseStudyForm: React.FC<CaseStudyFormProps> = ({ 
  isOpen, 
  onOpenChange,
  initialData,
  mode
}) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save the form data to the backend
    toast({
      title: mode === 'create' ? "Case Study Created" : "Case Study Updated",
      description: mode === 'create' 
        ? "Your new case study has been saved as a draft." 
        : "Your case study has been updated successfully.",
    });
    
    onOpenChange(false);
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
              defaultValue={initialData?.title || ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select defaultValue={initialData?.department || ''}>
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
              placeholder="Describe the case study"
              className="min-h-[100px]"
              defaultValue={initialData?.description || ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="learning_outcomes">Learning Outcomes</Label>
            <Textarea
              id="learning_outcomes"
              placeholder="What did you learn from this case?"
              className="min-h-[100px]"
              defaultValue={initialData?.learning_outcomes || ''}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-clinical-600 hover:bg-clinical-700">
              {mode === 'create' ? 'Create Draft' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyForm;
