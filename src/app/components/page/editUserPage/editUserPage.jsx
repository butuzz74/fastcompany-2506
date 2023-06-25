import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { validator } from "../../../utils/validator";
import { useQualities } from "../../../hooks/useQualities";
import { useProfessions } from "../../../hooks/useProfession";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useAuth } from "../../../hooks/useAuth";

const EditUserPage = () => {
    const history = useHistory();
    const [data, setData] = useState({
        name: "",
        email: "",
        profession: "",
        sex: "male",
        qualities: ""
    });
    const { currentUser, editUser } = useAuth();
    const [errors, setErrors] = useState({});

    const { qualities } = useQualities();
    const qualitiesList = qualities.map((q) => ({
        label: q.name,
        value: q._id
    }));
    const { professions } = useProfessions();
    const professionsList = professions.map((p) => ({
        label: p.name,
        value: p._id
    }));

    const getQualities = async (elements) => {
        if (qualities.length > 0) {
            const qualitiesArray = [];
            for (const elem of elements) {
                for (const quality of qualities) {
                    if (elem === quality._id) {
                        qualitiesArray.push({
                            value: quality._id,
                            label: quality.name
                        });
                    }
                }
            }
            return qualitiesArray;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const qualitiesArr = data.qualities.map((q) => q.value);
        const newData = {
            ...data,
            _id: currentUser._id,
            qualities: qualitiesArr
        };
        try {
            await editUser(newData);
            history.push(`/users/${currentUser._id}`);
        } catch (error) {
            setErrors(error);
        }
    };

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Имя обязательно для заполнения"
            },
            min: {
                message: "Имя должно состоять минимум из 3 символов",
                value: 3
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;
    useEffect(() => {
        const fetch = async () => {
            const arr = await getQualities(currentUser.qualities);
            return arr;
        };
        fetch().then((data) =>
            setData((prevState) => ({
                ...prevState,
                name: currentUser.name,
                email: currentUser.email,
                sex: currentUser.sex,
                qualities: data,
                profession: currentUser.profession
            }))
        );
    }, [qualities]);
    // useEffect(() => {
    //     setData((prevState) => ({
    //         ...prevState,
    //         name: currentUser.name,
    //         email: currentUser.email,
    //         sex: currentUser.sex,
    //         qualities: getQualities(currentUser.qualities),
    //         profession: currentUser.profession
    //     }));
    // }, [qualities]);

    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {professions.length > 0 &&
                    qualities.length > 0 &&
                    data.qualities ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                options={professionsList}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={data.qualities}
                                options={qualitiesList}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
