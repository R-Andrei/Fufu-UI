

function Button({
    disabled = false,
    loading = false,
    ghost = false,
    name = undefined,
    onClick = () => { },
    className = '',
    children,
    ...props
}) {

    const buttonClass = (className) ? ` ${className}` : '';
    const buttonGhost = (ghost) ? ' fufu-ghost' : '';
    const buttonDisabled = (disabled) ? ' fufu-disabled' : '';

    const handleClick = (event) => {
        onClick(event, { name });
    }

    return (<button name={name} onClick={handleClick} className={`fufu-button${buttonGhost}${buttonDisabled}${buttonClass}`} {...props}>
        {
            (loading)
                ? (<span>loader here</span>)
                : undefined
        }
        {children}
    </button>)
}


export default Button;