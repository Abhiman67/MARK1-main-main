import dynamic from 'next/dynamic';

const ChartWrapperClient = dynamic(() => import('./ChartWrapperClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Loading chart...</div>
    </div>
  )
});

export function ChartWrapper(props: any) {
  return <ChartWrapperClient {...props} />;
}
