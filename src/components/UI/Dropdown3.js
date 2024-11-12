import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const Dropdown3 = (props) => {
    const { data, title, setValue, setOption, option, disabled, style, loading } = props;
    const setMethodForValue = (e) => {
        setValue && setValue(e)
    }
    const setMethodForOption = (e) => {
        setOption && setOption(e)
    }
    return (
        <div className='m-2'>
            {title && <div className='ui inline m-2' style={{ fontWeight: 500 }}>{title + " "}</div>}
            <Dropdown
                text={option}
                inline
                disabled={disabled}
                className="customBorder"
                scrolling
                loading={loading}
            >
                <Dropdown.Menu style={style}>
                    {
                        data?.map((d, i) => {
                            return (
                                <Dropdown.Item
                                    key={i}
                                    text={d.option}
                                    onClick={() => { setMethodForOption(d.option); setMethodForValue(d.value); }}
                                />
                            )
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}
export default Dropdown3