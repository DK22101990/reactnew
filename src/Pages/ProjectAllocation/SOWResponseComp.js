import React, { useState } from 'react';
import { Accordion, Icon, Menu, Button, Table, Label } from 'semantic-ui-react';
import { SpinnerCircular } from 'spinners-react';

const sowResponseTableHeadings = [
    { key: "projectType", heading: "Project Type" },
    { key: "sowStartDate", heading: "SOW Start Date" },
    { key: "sowEndDate", heading: "SOW End Date" },
    { key: "projectDuration", heading: "Project Duration" },
    { key: "sowValue", heading: "SOW Value" },
    { key: "contractType", heading: "Contract Type" },
    { key: "isActiveText", heading: "Is Active" },
    { key: "clientContactPerson", heading: "Client Contact Person" },
    { key: "clientEmailId", heading: "Client Email Id" },
    { key: "sowPath", heading: "SOW Path" },
];

const SOWResponseComp = ({ sowResData = {}, loading, addNewResource }) => {
    sowResData.sowStartDate = new Date(sowResData?.sowStartDate).toLocaleDateString('en-CA');
    sowResData.sowEndDate = new Date(sowResData?.sowEndDate).toLocaleDateString('en-CA');
    sowResData.isActiveText = sowResData.isActive ? "Yes" : "No";

    const [activeIndex, setActiveIndex] = useState(0);
    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex)
    }
    return (
        <Accordion>
            <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={handleClick}
            >
                <Menu fluid widths={2}>
                    <Menu.Item position='left' active>
                        <Icon name='dropdown' />
                        <span>SOW Details</span>
                    </Menu.Item>
                    <Menu.Item position='right'>
                        <Button
                            primary
                            content="Add New Resource"
                            onClick={addNewResource}
                            disabled={!sowResData.isActive}
                        />
                    </Menu.Item>
                </Menu>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
                <Table celled selectable color={"blue"} padded>
                    <Table.Header>
                        <Table.Row>
                            {sowResponseTableHeadings.map(({ heading }, i) => <Table.HeaderCell key={i}>{heading}</Table.HeaderCell>)}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            loading ?
                                <Table.Cell colSpan={sowResponseTableHeadings.length} textAlign='center'>
                                    <div className='mt-10 allCenter'><SpinnerCircular enabled={true} /></div>
                                </Table.Cell>
                                :
                                <Table.Row positive>
                                    {
                                        sowResponseTableHeadings.map(({ key }, i) => <Table.Cell key={i}>
                                            <Label ribbon>{sowResData[key]}</Label>
                                        </Table.Cell>)
                                    }
                                </Table.Row>
                        }
                    </Table.Body>
                </Table>
            </Accordion.Content>
        </Accordion>
    )
}

export default SOWResponseComp;