import React from 'react';
import ReactDOM from 'react-dom';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import CompareIcon from '@material-ui/icons/Compare';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ListSubheader from '@material-ui/core/ListSubheader';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 100,
        width: 300,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
    spanTitle: {
        marginLeft: 20,
        fontSize: 18,
        fontWeight: 600,
    },
    centerAlignBtn: {
        textAlign: 'center',
        marginTop: 30,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    }
});

class MainDBCompare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            db1: {
                open: false,
                dbName: "test",
                host: "rm-bp191c9v0kh743587yo.mysql.rds.aliyuncs.com",
                port: "3306",
                user: "roothztest",
                password: "udrbU%Shf#QL9exEgx"

            },
            db1Temp: {
                dbName: "",
                host: "",
                port: "",
                user: "",
                password: ""
            },
            db2: {
                open: false,
                dbName: "online",
                host: "rm-bp1fsbzam00o76071uo.mysql.rds.aliyuncs.com",
                port: "3306",
                user: "roothzpro",
                password: "RdrbU%S5f#QL9YiEgV"

            },
            db2Temp: {
                dbName: "",
                host: "",
                port: "",
                user: "",
                password: ""
            },
            db1DataBases: [],
            showDataBase: false,
            labelWidth: 0,
            selectDatabase: "",
            tableInfos: [],
            showTables: false,
            openTableName: null
        };
    }

    openDB1Form = () => {
        var db1 = Object.assign({}, this.state.db1);
        db1.open = true;
        this.setState({db1: db1});
        this.setState({db1Temp: this.state.db1});
        console.log(this.state);

    };

    closeDB1Form = () => {
        var db1 = Object.assign({}, this.state.db1);
        db1.open = false;
        this.setState({db1: db1})
    };

    handleDb1Change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        //   更新状态
        var db1Temp = Object.assign({}, this.state.db1Temp);
        db1Temp[name] = value;
        this.setState({
            db1Temp: db1Temp
        });

    };

    saveDB1 = () => {

        var db1 = Object.assign({}, this.state.db1Temp);
        db1.open = false;
        this.setState({db1: db1});
        console.log(this.state);

    };


    openDB2Form = () => {
        var db2 = Object.assign({}, this.state.db2);
        db2.open = true;
        this.setState({db2: db2});
        this.setState({db2Temp: this.state.db2});

    };

    closeDB2Form = () => {
        var db2 = Object.assign({}, this.state.db2);
        db2.open = false;
        this.setState({db2: db2})
    };

    handleDb2Change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        //   更新状态
        var db2Temp = Object.assign({}, this.state.db2Temp);
        db2Temp[name] = value;
        this.setState({
            db2Temp: db2Temp
        });

    };

    saveDB2 = () => {

        var db2 = Object.assign({}, this.state.db2Temp);
        db2.open = false;
        this.setState({db2: db2});
        console.log(this.state);

    };

    listAllDataBases = (db, callback) => {
        const {ipcRenderer} = window.electron;
        ipcRenderer.once('allDataBases-r', (event, arg) => {
            console.log("rrrrrrrrrr");
            callback(arg);
        });
        ipcRenderer.send('allDataBases-m', db);
    };

    listDb1AllDataBases = () => {
        var that = this;
        this.listAllDataBases(this.state.db1, function (result) {
            console.log(result);
            if (null != result) {
                that.setState({db1DataBases: result});
            }

        })
        this.setState({showDataBase: true})
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSelectDataBase = event => {
        this.setState({[event.target.name]: event.target.value});
        console.log(event.target.value);
        if (null == event.target.value || "" == event.target.value) {
            return;
        }
        const {ipcRenderer} = window.electron;
        var that = this;
        var selectDataBase = event.target.value;
        ipcRenderer.once('mainDataBasesDetail-r', (event, arg) => {
            that.loadSecondDataBase(arg, selectDataBase);
        });
        var db = Object.assign({}, this.state.db1);
        db.selectDataBase = event.target.value;
        ipcRenderer.send('mainDataBasesDetail-m', db);
    };

    loadSecondDataBase = (result, databaseName) => {
        var that = this;
        const {ipcRenderer} = window.electron;
        ipcRenderer.once('secondDataBasesDetail-r', (event, arg) => {
            that.compareDatabase(result, arg, databaseName);
        });
        var db = Object.assign({}, this.state.db2);
        db.selectDataBase = databaseName;
        ipcRenderer.send('secondDataBasesDetail-m', db);
    };

    compareDatabase = (result1, result2, arg) => {
        var that = this;

        if (null == result1 || null == result2) {
            return;
        }
        let newTables = [];
        let tableInfos = [];
        Object.keys(result1).forEach(function (key) {
            let col1 = result1[key];
            let col2 = result2[key];
            let tableInfo = {};
            tableInfo.newTable = false;
            if (null == col2) {
                tableInfo.newTable = true;
            }

            let newColumns = [];
            let sameColums = [];
            let diffColums = [];

            if (null != col1) {
                col1.forEach(v => {
                    let compareColumn = that.findCompareColumn(v, col2);
                    if (compareColumn != null) {
                        let isSameColum = that.compareTwoColumn(v, compareColumn);
                        if (isSameColum) {
                            sameColums.push(v);
                        }
                        else {
                            var diffInfo = {newCol: v, oldCol: compareColumn};
                            diffColums.push(diffInfo);
                        }
                    }
                    else {

                        newColumns.push(v);
                    }
                });
            }
            tableInfo.newColumns = newColumns;
            tableInfo.sameColums = sameColums;
            tableInfo.diffColums = diffColums;
            tableInfo.tableName = key;
            tableInfos.push(tableInfo);

        });
        console.log(tableInfos);
        this.setState({showTables: true, tableInfos: tableInfos});


    };

    findCompareColumn = (v, cols) => {
        if (null == cols) {
            return null;
        }

        for (let v1 of cols) {
            if (v.columnName == v1.columnName) {
                return v1;
            }
        }

        return null;

    };

    compareTwoColumn = (v1, v2) => {
        if (v1.dataType == v2.dataType && v1.columnType == v2.columnType && v1.columnComment == v2.columnComment) {
            return true;
        }
        return false;

    };

    handleListClick = value => (event, expanded) => {
        console.log(value);
        if (this.state.openTableName == value.tableName) {
            this.setState({
                openTableName: null,
            });
        }
        else {
            this.setState({
                openTableName: value.tableName,
            });
        }

    }


    render() {
        const {classes} = this.props;
        return (
            <Grid container className={classes.root} spacing={16}>
                <Grid item xs={12}>
                    <Grid container className={classes.demo} justify="center" spacing={40}>
                        <Grid key="db1" item>
                            <Paper className={classes.paper}>
                                <div style={{paddingTop: 10}}><span
                                    className={classes.spanTitle}>数据库名1：</span>{this.state.db1.dbName}</div>
                                <div className={classes.centerAlignBtn}><Button variant="outlined" color="primary"
                                                                                onClick={this.openDB1Form}>
                                    修改数据库
                                </Button></div>

                            </Paper>
                            <Dialog
                                open={this.state.db1.open}
                                onClose={this.closeDB1Form}
                                aria-labelledby="form-dialog-title"
                            >
                                <DialogTitle id="form-dialog-title">修改数据库1</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        name="dbName"
                                        label="数据库名"
                                        type="text"
                                        value={this.state.db1Temp.dbName}
                                        required={true}
                                        onChange={this.handleDb1Change}
                                        fullWidth
                                    />
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        name="host"
                                        label="主机名/IP"
                                        type="text"
                                        value={this.state.db1Temp.host}
                                        onChange={this.handleDb1Change}
                                        fullWidth
                                    />
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        name="port"
                                        label="端口"
                                        type="text"
                                        onChange={this.handleDb1Change}
                                        value={this.state.db1Temp.port}
                                        fullWidth
                                    />
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        name="user"
                                        label="用户"
                                        type="text"
                                        onChange={this.handleDb1Change}
                                        value={this.state.db1Temp.user}
                                        fullWidth
                                    />
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        name="password"
                                        label="密码"
                                        type="password"
                                        onChange={this.handleDb1Change}
                                        value={this.state.db1Temp.password}
                                        fullWidth
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.closeDB1Form} color="primary">
                                        取消
                                    </Button>
                                    <Button onClick={this.saveDB1} color="primary">
                                        保存
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                        <Grid key="db2" item>
                            <Paper className={classes.paper}>
                                <div style={{paddingTop: 10}}><span
                                    className={classes.spanTitle}>数据库名2：</span>{this.state.db2.dbName}</div>
                                <div className={classes.centerAlignBtn}><Button variant="outlined" color="primary"
                                                                                onClick={this.openDB2Form}>
                                    修改数据库
                                </Button></div>
                                <Dialog
                                    open={this.state.db2.open}
                                    onClose={this.closeDB2Form}
                                    aria-labelledby="form-dialog-title"
                                >
                                    <DialogTitle id="form-dialog-title">修改数据库2</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            name="dbName"
                                            label="数据库名"
                                            type="text"
                                            value={this.state.db2Temp.dbName}
                                            required={true}
                                            onChange={this.handleDb2Change}
                                            fullWidth
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            name="host"
                                            label="主机名/IP"
                                            type="text"
                                            value={this.state.db2Temp.host}
                                            onChange={this.handleDb2Change}
                                            fullWidth
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            name="port"
                                            label="端口"
                                            type="text"
                                            onChange={this.handleDb2Change}
                                            value={this.state.db2Temp.port}
                                            fullWidth
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            name="user"
                                            label="用户"
                                            type="text"
                                            onChange={this.handleDb2Change}
                                            value={this.state.db2Temp.user}
                                            fullWidth
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            name="password"
                                            label="密码"
                                            type="password"
                                            onChange={this.handleDb2Change}
                                            value={this.state.db2Temp.password}
                                            fullWidth
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={this.closeDB2Form} color="primary">
                                            取消
                                        </Button>
                                        <Button onClick={this.saveDB2} color="primary">
                                            保存
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.centerAlignBtn} style={{marginTop: 5}}>
                        <Button onClick={this.listDb1AllDataBases} variant="contained" color="secondary"
                                className={classes.button}>
                            获取DATABASE
                        </Button>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        marginTop: 5,
                        display: this.state.showDataBase ? 'block' : 'none'
                    }}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel
                                ref={ref => {
                                    this.InputLabelRef = ref;
                                }}
                                htmlFor="outlined-database-simple"
                            >
                                DataBase
                            </InputLabel>
                            <Select
                                value={this.state.selectDatabase}
                                onChange={this.handleSelectDataBase}
                                input={
                                    <OutlinedInput
                                        labelWidth={this.state.labelWidth}
                                        name="selectDatabase"
                                        id="outlined-database-simple"
                                    />
                                }
                            >
                                {this.state.db1DataBases.map((value, index) => (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        marginTop: 5,
                        display: this.state.showTables ? 'block' : 'none'
                    }}>
                        <List
                            component="nav"
                            subheader={<ListSubheader component="div"></ListSubheader>}
                            className={classes.root}
                        >
                            {this.state.tableInfos.map((value, index) => (
                                <div key={value.tableName}>
                                    <ListItem key={value.tableName} button onClick={this.handleListClick(value)}>
                                        <ListItemIcon>
                                            <InboxIcon/>
                                        </ListItemIcon>
                                        <ListItemText inset primary={value.tableName}/>
                                        {this.state.openTableName == value.tableName ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItem>
                                    <Collapse in={this.state.openTableName == value.tableName} timeout="auto"
                                              unmountOnExit>
                                        <Card className={classes.card}>
                                            <CardContent>
                                                <Typography className={classes.title} color="textSecondary"
                                                            gutterBottom>
                                                    Word of the Day
                                                </Typography>
                                                <Typography variant="h5" component="h2">
                                                    be

                                                    nev
                                                    lent
                                                </Typography>
                                                <Typography className={classes.pos} color="textSecondary">
                                                    adjective
                                                </Typography>
                                                <Typography component="p">
                                                    well meaning and kindly.
                                                    <br/>
                                                    {'"a benevolent smile"'}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small">Learn More</Button>
                                            </CardActions>
                                        </Card>
                                    </Collapse>
                                </div>
                            ))}
                        </List>

                    </div>
                </Grid>

            </Grid>
        );
    }
}

export default withStyles(styles)(MainDBCompare);