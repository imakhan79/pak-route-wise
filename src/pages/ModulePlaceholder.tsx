import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  subtitle?: string;
}

export default function ModulePlaceholder({ title, subtitle }: ModulePlaceholderProps) {
  return (
    <MainLayout title={title} subtitle={subtitle}>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Construction className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">{title} is coming soon</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            This module is on the roadmap and isn't built yet. Check back soon.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
