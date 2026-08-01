import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PortalLayout from './PortalLayout';
import { usePortalShipment, usePortalDocuments } from '@/hooks/usePortal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Upload, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIMELINE_STATUSES = ['pending', 'approved', 'in_transit', 'customs_hold', 'cleared', 'delivered'];

export default function ShipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: shipment } = usePortalShipment(id);
  const { data: documents = [], uploadDocument } = usePortalDocuments(id);
  const [docType, setDocType] = useState('');
  const [docNumber, setDocNumber] = useState('');

  const currentIndex = shipment ? TIMELINE_STATUSES.indexOf(shipment.status) : -1;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docType) return;
    uploadDocument({ type: docType, document_number: docNumber, file_url: `uploaded/${docType}-${Date.now()}.pdf` });
    setDocType('');
    setDocNumber('');
  };

  if (!shipment) {
    return <PortalLayout><p className="text-sm text-muted-foreground">Loading...</p></PortalLayout>;
  }

  return (
    <PortalLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-mono">{shipment.shipment_id}</h1>
        <Badge variant="outline" className="text-sm">{shipment.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Status Timeline</CardTitle></CardHeader>
          <CardContent>
            {shipment.status === 'cancelled' ? (
              <p className="text-sm text-destructive">This shipment was cancelled.</p>
            ) : (
              <div className="flex flex-col gap-0">
                {TIMELINE_STATUSES.map((s, i) => (
                  <div key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn('flex h-7 w-7 items-center justify-center rounded-full border-2', i <= currentIndex ? 'border-primary bg-primary text-white' : 'border-muted text-muted-foreground')}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      {i !== TIMELINE_STATUSES.length - 1 && <div className={cn('w-0.5 grow', i < currentIndex ? 'bg-primary' : 'bg-muted')} style={{ minHeight: 28 }} />}
                    </div>
                    <p className={cn('pb-7 text-sm capitalize', i <= currentIndex ? 'font-semibold' : 'text-muted-foreground')}>{s.replace('_', ' ')}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Origin:</span> {shipment.origin}</p>
              <p><span className="text-muted-foreground">Destination:</span> {shipment.destination}</p>
              <p><span className="text-muted-foreground">Commodity:</span> {shipment.commodity || '—'}</p>
              <p><span className="text-muted-foreground">Weight:</span> {shipment.weight ? `${shipment.weight} kg` : '—'}</p>
              <p><span className="text-muted-foreground">ETA:</span> {shipment.eta ? new Date(shipment.eta).toLocaleString() : '—'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Documents</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {documents.map((d: any) => (
                <div key={d.id} className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{d.type} {d.document_number ? `#${d.document_number}` : ''}</span>
                  <Badge variant="outline" className="text-[10px]">{d.status}</Badge>
                </div>
              ))}
              <form onSubmit={handleUpload} className="space-y-2 border-t pt-3">
                <Label className="text-xs">Upload Document</Label>
                <Input placeholder="Type (invoice, packing_list...)" value={docType} onChange={(e) => setDocType(e.target.value)} className="h-8 text-sm" />
                <Input placeholder="Document number" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="h-8 text-sm" />
                <Button type="submit" size="sm" className="w-full"><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
