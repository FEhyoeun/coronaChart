import React from 'react';

const Header = () => {
    return (
        <header className="header">
            <h1>
                COVID-19
           </h1>
            <select>
                <option>국내(KOR)</option>
                <option>국외(USA)</option>
            </select>
        </header>
    );
};

export default Header;