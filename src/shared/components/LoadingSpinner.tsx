type LoadingSpinnerProps = {
    size?: number
}

export function LoadingSpinner ({ size }: LoadingSpinnerProps = { size: 48 }) {
    return <i className="animate-spin ph ph-circle-notch" style={{ fontSize: size }}></i>
}