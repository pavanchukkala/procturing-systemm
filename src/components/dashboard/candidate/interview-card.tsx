
import type { CandidateInterview, InterviewStatus, MockStatus } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, CheckCircle, Clock, HelpCircle, ListChecks, PlayCircle, RefreshCw, FileText, Video, Users } from 'lucide-react';

const getStatusBadgeVariant = (status: InterviewStatus | MockStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Pending':
    case 'Upcoming':
    case 'Not Taken':
      return 'outline';
    case 'In Progress':
      return 'default'; 
    case 'Submitted':
    case 'Completed':
    case 'Taken':
    case 'Reviewed':
      return 'secondary';
    case 'Missed':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getActionForStatus = (interview: CandidateInterview): { text: string; icon: React.ElementType, variant?: "default" | "secondary" | "outline", link?: string, disabled?: boolean } => {
  const isMockInterview = interview.type === 'Mock Interview';
  const isActualInterview = interview.type === 'Interview'; 
  const isExam = interview.type === 'Exam' || interview.type === 'Mock Exam';

  let baseLink: string;
  let actionTextPrefix: string;
  let actionIcon: React.ElementType = PlayCircle;

  if (isActualInterview) {
    
    baseLink = `/interview-session/${interview.id}`;
    actionTextPrefix = "Live Interview";
    actionIcon = Users; 
  } else if (isMockInterview) {
    
    baseLink = `/candidate/interview/${interview.id}`; 
    actionTextPrefix = "Mock Interview";
    actionIcon = Video; 
  } else { 
    
    baseLink = `/candidate/exam/${interview.id}`;
    actionTextPrefix = interview.type === 'Exam' ? "Exam" : "Mock Exam";
    actionIcon = ListChecks;
  }

  if (isMockInterview) {
    if (interview.status === 'Not Taken') return { text: `Start ${actionTextPrefix}`, icon: actionIcon, link: baseLink };
    if (interview.status === 'Taken' || interview.status === 'Reviewed') return { text: `Review ${actionTextPrefix}`, icon: CheckCircle, variant: "secondary", link: `/candidate/report/${interview.id}?type=mock_interview` };
    return { text: `View ${actionTextPrefix}`, icon: ListChecks, variant: "outline", link: baseLink };
  }
  
  if (isActualInterview) {
     switch (interview.status) {
      case 'Pending':
      case 'Upcoming':
        return { text: `Join ${actionTextPrefix}`, icon: actionIcon, link: baseLink };
      case 'In Progress':
        return { text: `Resume ${actionTextPrefix}`, icon: actionIcon, link: baseLink };
      case 'Submitted': 
      case 'Completed':
        return { text: 'View Summary', icon: FileText, variant: "secondary", link: `/candidate/report/${interview.id}?type=live_interview` };
      case 'Missed':
         return { text: 'Details', icon: ListChecks, variant: "outline", disabled: true };
      default:
        return { text: `View ${actionTextPrefix} Details`, icon: ListChecks, variant: "outline", link: `/candidate/details/${interview.id}` };
    }
  }

  
  if (isExam) {
    const examTypePrefix = interview.type === 'Mock Exam' ? 'Mock Exam' : 'Exam';
     if (interview.status === 'Not Taken') return { text: `Start ${examTypePrefix}`, icon: PlayCircle, link: baseLink }; 
     switch (interview.status) {
        case 'Pending': 
        case 'Upcoming':
          return { text: `Start ${examTypePrefix}`, icon: PlayCircle, link: baseLink };
        case 'In Progress':
          return { text: `Resume ${examTypePrefix}`, icon: RefreshCw, link: baseLink };
        case 'Submitted':
        case 'Completed':
           return { text: 'View Report', icon: FileText, variant: "secondary", link: `/candidate/report/${interview.id}?type=exam` };
        case 'Taken': 
        case 'Reviewed': 
            return { text: `Review ${examTypePrefix}`, icon: CheckCircle, variant: "secondary", link: `/candidate/report/${interview.id}?type=mock_exam` };
        case 'Missed':
           return { text: 'Details', icon: ListChecks, variant: "outline", disabled: true };
        default:
          return { text: `View ${examTypePrefix} Details`, icon: ListChecks, variant: "outline", link: `/candidate/details/${interview.id}` };
    }
  }
  
  
  return { text: 'View Details', icon: ListChecks, variant: "outline", link: `/candidate/details/${interview.id}` };
};


export function InterviewCard({ interview }: { interview: CandidateInterview }) {
  const action = getActionForStatus(interview);
  const IconForCard = interview.type === 'Interview' ? Users : interview.type === 'Mock Interview' ? Video : HelpCircle;


  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-primary/20 transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Image
            src={interview.companyLogoUrl}
            alt={`${interview.companyName} logo`}
            width={40}
            height={40}
            className="rounded-full object-contain"
            data-ai-hint={`${interview.companyName} logo company`}
          />
          <div>
            <CardTitle className="text-lg font-semibold">{interview.role}</CardTitle>
            <p className="text-sm text-muted-foreground">{interview.companyName} ({interview.type})</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2 text-primary" />
          <span>{interview.scheduledDate}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          <span>Duration: {interview.duration}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <IconForCard className="h-4 w-4 mr-2 text-primary" />
          <span>Format: {interview.questions}</span>
        </div>
        {(interview.lpa || interview.stipend) && (
          <p className="text-sm font-medium text-foreground">
            {interview.lpa ? `CTC: ${interview.lpa}` : `Stipend: ${interview.stipend}`}
          </p>
        )}
         <Badge variant={getStatusBadgeVariant(interview.status)} className="capitalize text-xs">
          {interview.status}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/30">
        {action.link ? (
          <Button asChild className="w-full" variant={action.variant || "default"} disabled={action.disabled}>
            <Link href={action.link}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.text}
            </Link>
          </Button>
        ) : (
          <Button className="w-full" variant={action.variant || "default"} disabled={action.disabled}>
            <action.icon className="mr-2 h-4 w-4" />
            {action.text}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
