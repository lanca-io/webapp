import './SkeletonLoader.pcss'

type SkeletonLoaderProps = {
	className?: string
	width?: number | string
	height: number | string
}

export function SkeletonLoader({
	className,
	width,
	height,
}: SkeletonLoaderProps) {
	return <div style={{ width, height }} className={`line ${className}`} />
}
