import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { uploadFile, getFiles, deleteFile } from '../../core/actions/filesAccions'
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    actionArea: {
        marginTop: 5,
        marginBottom: 10
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    lista: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        paddingBottom: 5,
        width: "auto",
        borderBottom: "2px solid grey"
    },
    textList: {
        display: "flex",
        width: "50%",
        justifyContent: "center",
        alignItems: "center"
    },
    pictureList: {
        position: "relative",
        left: 0,
        width: "30%",
        justifyContent: "center",
        alignItems: "center"
    },
    img: {
        width: "100%"
    },
    iconList: {
        position: "relative",
        right: 0,
        width: "10%",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },
}));

export default function Files({ userConected }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [fileSelected, setFile] = useState()
    const [filesList, setFileList] = useState()
    const [reload, setReload] = useState(false)
    const [itemId, setItemId] = useState()

    const fileList = async () => {
        let email = userConected?.email
        await getFiles(email)
            .then(response => {
                setFileList(response.user.data.response.files)
            })
    }

    const upload = async (e) => {
        e.preventDefault()
        let file = await e.target.files[0]
        console.log(file)
        setFile(file)
        let user = userConected.email
        const formData = new FormData()
        formData.append('user', user)
        formData.append('file', file)

        await uploadFile(formData)
            .then(response => {

                if (response.success) {
                    alert("Carga Exitosa")
                }
                else { alert("archivo ya cargado") }
            })
        setReload(!reload)
    }

    const deleteItem = async (event) => {
        let { id } = event.target
        let email = await userConected?.email
        await deleteFile(id, email)
            .then(response => {
                alert(response.response.mensaje)
            })
        setReload(!reload)

    }

    useEffect(() => {
        fileList()
    }, [reload])

    const handleOpen = () => {
        open ? setOpen(false) : setOpen(true)
    };

    return (
        <div>
            <Button
                onClick={handleOpen}
            >
                <FolderOpenIcon style={{ color: "white" }} />
            </Button>

            {open &&

                <Card style={{
                    position: 'absolute',
                    top: "80px",
                    right: "10px",
                    width: '40vw',

                }}>
                    <CardContent>
                        <div className={classes.actionArea}>
                            <input type="file"
                                onChange={upload}
                                id="icon-button-file"
                                style={{ display: 'none', }}
                                multiple
                            />
                            <label htmlFor="icon-button-file">
                                <Button
                                    variant="contained"
                                    component="span"
                                    style={{ width: "100%", marginBotton: 5, marginTop: 5 }}
                                    startIcon={<CloudUploadIcon />}>
                                    Upload
                                </Button>
                            </label>
                        </div>

                        <div className={classes.demo}>
                            {(!filesList.length > 0)
                                ? (<div>NO POSEE ARCHIVOS CARGADOS</div>)
                                : (filesList.map(item =>
                                    <div className={classes.lista} key={item.id}>
                                        <div className={classes.pictureList}>
                                            <img
                                                className={classes.img}
                                                src={process.env.PUBLIC_URL + `/files/${item.id}`} alt={item.name} />
                                        </div>

                                        <div className={classes.textList}>
                                            {item.name}

                                        </div>
                                        <div className={classes.iconList}>
                                            <Button id={item.id} onClick={deleteItem} >
                                                <DeleteIcon />
                                            </Button>
                                        </div>
                                    </div>)
                                )}
                        </div>
                    </CardContent>
                </Card>
            }
        </div>
    );
}