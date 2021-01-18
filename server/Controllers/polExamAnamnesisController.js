const polExamAnamnesisSaveSchema = require('../models/polExamAnamnesisModel');
const polExamSaveSchema = require('../models/polExamModel');
const appointmentSaveSchema = require('../models/appointmentModel');
const patientDiagnosisSaveSchema = require('../models/diagnosisModel');
const allDiagnosisSaveSchema = require('../models/allDiagnosisModel');
const myMongoose = require('mongoose');
const myMoment = require('moment');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myPolExamAnamnesisModel = myMongoose.model('polyclinicanamneses');
var myPolExamModel = myMongoose.model('polyclinicExam');
var myPatientsModel = myMongoose.model('patients');
var myStaffModel = myMongoose.model('staffs');
var myAppointmentModel = myMongoose.model('appointments');
var myPatientdiagnosisModel = myMongoose.model('patientdiagnoses');
var allDiagnosisModel = myMongoose.model('diagnosistables');

module.exports.savePolExamAnamnesis = (req, res) => {

    const newPolExamAnamnesis = new polExamAnamnesisSaveSchema({
        patientProtocolNo: req.body.patientProtocolNo,
        patientId: req.body.patientId,
        patientIdNo: req.body.patientIdNo,
        patientNameSurname: req.body.patientNameSurname,
        appointmentStatus: req.body.appointmentStatus,
        patientStory: req.body.patientStory,
        patientAnamnesis: req.body.patientAnamnesis,
        patientExamination: req.body.patientExamination,
        patientSavedUser: req.body.patientSavedUser,
        saveDate: req.body.saveDate,
        polyclinicSelect: req.body.polyclinicSelect
    })
    newPolExamAnamnesis.save()
        .then(polExam => {
            res.send(polExam);
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.updatePolExamAnamnesis = (req, res) => {
    myPolExamAnamnesisModel.findOneAndUpdate(
        { patientProtocolNo: req.body.patientProtocolNo },
        {
            $set: {
                patientStory: req.body.patientStory,
                patientAnamnesis: req.body.patientAnamnesis,
                patientExamination: req.body.patientExamination
            }
        },
        { useFindAndModify: false })
        .then(patientAnamnesisData => {
            res.send(patientAnamnesisData);
            // console.log("Patient data updated! = " + patientAnamnesisData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.findPatientList = (req, res) => {
    myPolExamModel.find(req.query)
        .then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.diagnosisList = (req, res) => {
    allDiagnosisModel.find().sort({ 'icd10': 1 })
        .then(diagnosisData => {
            res.send(diagnosisData);
            // console.log("All diagnosis data: " + diagnosisData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.savePolExamDiagnosis = (req, res) => {
    const newPatientDiagnosisSaveSchema = new patientDiagnosisSaveSchema({
        patientProtocolNo: req.body.patientProtocolNo,
        patientIdNo: req.body.patientIdNo,
        patientId: req.body.patientId,
        icd10: req.body.icd10,
        diagnosisType: req.body.diagnosisType1,
        diagnosisName: req.body.diagnosisName1,
        diagnosisUser: req.body.diagnosisUser1,
        diagnosisDate: req.body.diagnosisDate1
    });
    newPatientDiagnosisSaveSchema.save()
        .then(polExam => {
            res.send(polExam);
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.findPatientDiagnosisHistory = (req, res) => {
    myPatientdiagnosisModel.find(req.query)
        .then(patientDiagnosisData => {
            res.send(patientDiagnosisData);
            // console.log("patient diagnosis found! = " + patientDiagnosisData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.deletePatientDiagnosis = (req, res) => {

    myPatientdiagnosisModel.deleteOne(req.query)
        .then(diagnosis => {
            res.send(diagnosis);
            // console.log("Diagnosis deleted! ");
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updateDiagnosisType = (req, res) => {
    myPatientdiagnosisModel.findOneAndUpdate(
        {
            patientProtocolNo: req.body.patientProtocolNo,
            icd10: req.body.icd10
        },
        {
            $set: {
                diagnosisType: req.body.diagnosisType
            }
        },
        { useFindAndModify: false })
        .then(diagnosisData => {
            res.send(diagnosisData);
            // console.log("diagnosisData updated! = " + diagnosisData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.getPatientPersonalIdNo = (req, res) => {
    myPolExamModel.aggregate
        ([
            {
                $match:
                    { patientProtocolNo: +req.query.patientProtocolNo }
            },
            {
                $lookup:
                {
                    from: 'patients',
                    localField: 'patientIdNo',
                    foreignField: 'patientIdNo',
                    as: 'patientData'
                }
            }
        ]).then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.getPatientDataToCookie = (req, res) => {
    myPatientsModel.find
        (req.query).then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.findPatientAnamnesisByProtocol = (req, res) => {
    myPolExamAnamnesisModel.find(req.query)
        .then(patientAnamnesisData => {
            res.send(patientAnamnesisData);
            // console.log("patient found! = " + patientAnamnesisData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPatientAppointmentStatusTable = (req, res) => {
    myAppointmentModel.find(req.query)
        .then(appointmentData => {
            res.send(appointmentData);
            // console.log("appointment found! = " + appointmentData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPatientUpcomingAppointmentTable = (req, res) => {
    var today = myMoment().format('DD-MM-YYYY');
    myAppointmentModel.find(
        {
            patientId: (+req.query.patientId),
            appointmentStatus: 'Valid',
            appointmentDate: { $gte: today }
        })
        .then(appData => {
            res.send(appData);
            // console.log('appData= ' + appData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPatientVisitStatisticsTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientId: (+req.query.patientId),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': "$polyclinicSelect",
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(polData => {
            res.send(polData);
            // console.log('polData= ' + polData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPolyclinicPatientCountTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientPolExamDate: (req.query.patientPolExamDate),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': "$polyclinicSelect",
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(polData => {
            res.send(polData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPatientHealtInsuranceTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientPolExamDate: (req.query.patientPolExamDate),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': {
                    polyclinicSelect: "$polyclinicSelect",
                    insuranceSelect: "$insuranceSelect"
                },
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(polData => {
            res.send(polData);
            // console.log(polData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPatientGenderTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientPolExamDate: (req.query.patientPolExamDate),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': {
                    polyclinicSelect: "$polyclinicSelect",
                    patientGender: "$patientGender"
                },
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(polData => {
            res.send(polData);
            // console.log(polData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillDoctorPatientTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientPolExamDate: (req.query.patientPolExamDate),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': {
                    doctorSelector: "$doctorSelector",
                    polyclinicSelect: "$polyclinicSelect"
                },
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(doctorData => {
            res.send(doctorData);
            // console.log('fillDoctorPatientTable= ', doctorData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillDoctorAppointmentTable = (req, res) => {
    var today = myMoment().format('DD-MM-YYYY');
    myAppointmentModel.aggregate([
        {
            $match: {
                appointmentDate: today,
                appointmentStatus: 'Valid'
            }
        },
        {
            $group: {
                '_id': "$appointmentDoctor",
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(doctorAppData => {
            res.send(doctorAppData);
            // console.log(doctorAppData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillDoctorOnLeaveTable = (req, res) => {
    var today = myMoment().toDate();

    myStaffModel.aggregate(
        [
            {
                $match: {
                    'staffLeaveEndDate': { $gte: today },
                    staffGroup: 'Doctor'
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]
    )
        .then(doctorOnLeave => {
            res.send(doctorOnLeave);
            // console.log('doctorOnLeave = ', doctorOnLeave);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};