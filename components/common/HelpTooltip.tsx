import React from 'react';

interface HelpTooltipProps {
    text: string;
}

const HelpTooltip = ({ text }: HelpTooltipProps) => {
    return (
        <div className="help-tooltip" role="tooltip" aria-label={text}>
            <span className="help-tooltip-icon">?</span>
            <div className="help-tooltip-text">{text}</div>
        </div>
    );
};

export default HelpTooltip;
