import React, { useState } from "react";
import { renderToStaticMarkup } from 'react-dom/server';

import { parseDirection } from '../utils';


function Popup({
    trigger,
    direction = "s",
    disabled = false,
    className = "",
    open: propsOpen = false,
    openOn = "hover",
    children
}) {

    const [open, setOpen] = useState(propsOpen);
    const [fufuPopup, setFufuPopup] = useState(null);

    const disabledClass = (disabled) ? ' fufu-disabled' : '';
    const fufuClass = `${disabledClass}${className}`;
    const fufuDirection = parseDirection(direction);

    const createPopup = (event) => {

        const content = (
            <div className={`fufu-popup ${fufuDirection}${fufuClass}`}>
                {children}
            </div>
        );
        const htmlContent = renderToStaticMarkup(content);

        const fufuWrapper = document.createElement('div');
        fufuWrapper.classList.add('fufu-popup-wrapper');
        fufuWrapper.innerHTML = htmlContent;
        fufuWrapper.style.opacity = 0;

        document.body.appendChild(fufuWrapper);

        const targetRect = event.target.getBoundingClientRect();
        const top = targetRect.top + window.scrollY;
        const bottom = targetRect.bottom + window.scrollY;
        const left = targetRect.left + window.scrollX;
        const right = targetRect.right + window.scrollX;

        const triggerHorizontalOffset = (right - left) / 2;
        const fufuHorizontalOffset = fufuWrapper.offsetWidth / 2;

        const triggerVerticalOffset = (bottom - top) / 2;
        const fufuVerticalOffset = fufuWrapper.offsetHeight / 2;

        const marginOffset = 6;

        let x = 0;
        let y = 0;

        if (fufuDirection === 's') {
            x = Math.round(left + triggerHorizontalOffset - fufuHorizontalOffset);
            y = Math.round(bottom) + marginOffset;
        } else if (fufuDirection === 'n') {
            x = Math.round(left + triggerHorizontalOffset - fufuHorizontalOffset);
            y = Math.round(top - fufuWrapper.offsetHeight) - marginOffset;
        } else if (fufuDirection === 'e') {
            x = Math.round(right) + marginOffset;
            y = Math.round(top + triggerVerticalOffset - fufuVerticalOffset);
        } else if (fufuDirection === 'w') {
            x = Math.round(left - fufuWrapper.offsetWidth) - marginOffset;
            y = Math.round(top + triggerVerticalOffset - fufuVerticalOffset);
        } else if (fufuDirection === 'se') {
            x = Math.round(right) + marginOffset;
            y = Math.round(top);
        } else if (fufuDirection === 'sw') {
            x = Math.round(left - fufuWrapper.offsetWidth) - marginOffset;
            y = Math.round(top);
        } else if (fufuDirection === 'ne') {
            x = Math.round(right) + marginOffset;
            y = Math.round(bottom - fufuWrapper.offsetHeight);
        } else if (fufuDirection === 'nw') {
            x = Math.round(left - fufuWrapper.offsetWidth) - marginOffset;
            y = Math.round(bottom - fufuWrapper.offsetHeight);
        }

        fufuWrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        fufuWrapper.style.opacity = 1;
        setFufuPopup(fufuWrapper);
    }

    const handleOpen = (e) => {
        createPopup(e);
        setOpen(true);
    }

    const handleClose = () => {
        document.body.removeChild(fufuPopup);
        setFufuPopup(null);
        setOpen(false);
    }

    const fufuTrigger = React.Children.map(trigger, (child) => {
        if (React.isValidElement(child)) {
            let newProps = {};

            if (openOn === 'click') {
                const handleClick = (e) => {
                    e.stopPropagation();

                    if (!open) {
                        handleOpen(e);
                    } else {
                        handleClose();
                    }

                    child.props.onClick();
                }
                newProps = {
                    onClick: handleClick,
                    onBlur: handleClose
                }
            }

            if (openOn === 'hover') {
                const handleEnter = (e) => {
                    e.stopPropagation();
                    handleOpen(e);
                }

                const handleLeave = (e) => {
                    e.stopPropagation();
                    handleClose();
                }

                newProps = {
                    onMouseEnter: handleEnter,
                    onMouseLeave: handleLeave
                }
            }

            return React.cloneElement(child, newProps);
        }
        return child;
    });
    return fufuTrigger;
}

export default Popup;
