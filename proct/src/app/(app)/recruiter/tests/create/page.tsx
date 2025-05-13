import { CreateTestWizard } from '@/components/dashboard/recruiter/create-test-wizard/create-test-wizard';
import { PageHeader } from '@/components/shared/page-header';
import { FilePlus2 } from 'lucide-react';

export default function CreateTestPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Test Paper"
        description="Follow the steps to build and customize your test paper."
        icon={FilePlus2}
      />
      <CreateTestWizard />
    </div>
  );
}