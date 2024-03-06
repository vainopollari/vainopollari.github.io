import { ChangeEvent, useCallback, useRef, useState } from 'react';
import './App.css'

const NAME_OR_MARK = "Nimi tai nimimerkki*";
const SONG = "Biisi*"
const FACEPICTURE = "Kasvokuva"
const PERMISSION_TEXT = "Sallin tietojeni tallennuksen karaokejärjestelmään";

interface NotificationProps {
    message: string;
}

const Loader: React.FC = () => (
    <span className="loader"></span>
);

const Notification: React.FC<NotificationProps> = props => (
    <div className="alert-box">
      {props.message}
    </div>
);


export const NameForm: React.FC = () => {
    const [name, setName] = useState<string>("")
    const [songName, setSongName] = useState<string>("DEFAULT")
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | undefined | null>();
    const [showLoader, setShowLoader] = useState(false);
    const [allFieldsValid, setAllFieldsValid] = useState<boolean>(true);

    const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setName(event?.target.value);
    }, [])

    const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        setFile(selectedFile);
    };
    
    const handleButtonClick = useCallback(() => {
        const checkBoxElement = document.getElementById("save_permission") as HTMLInputElement;
        console.log(name)
        console.log(songName)
        console.log(selectedKey)
        console.log(checkBoxElement.checked)
        const areAllFieldsChecked = name !== "" && songName !== "DEFAULT" && 
                                    selectedKey !== null && checkBoxElement.checked;

        if (!areAllFieldsChecked) {
            setAllFieldsValid(false);
            setTimeout(() => {
               setAllFieldsValid(true)
            }, 2000);
        }
        else {
            setShowLoader(true);

            setTimeout(() => {
                setShowLoader(false);
                setName("");
                setSelectedKey(null);
                setSongName("DEFAULT");
                if (file !== null) {
                    setFile(null);
                }
            }, 2000);
        }
    }, [name, songName, selectedKey, file])

    const handleKeySelection = useCallback((value: string) => {
        console.log("Key: ", value)
        setSelectedKey((prev) => (prev === value ? null : value));
      }, []);

    const getButtonClassName = (value: string) => {
        return `selection-button ${selectedKey === value ? 'selected' : ''}`;
    };
    
    return (
        <div className="karaoke-form">
            <label>{NAME_OR_MARK}</label>
            <input
                type="text"
                id="personName"
                value={name}
                onChange={handleNameChange}
                className="karaoke-form-name-input"
            />

            <label>{FACEPICTURE}</label>
            <button onClick={() => fileRef.current?.click()} className="facepicture">
                <input
                id="upload"
                name="upload"
                type="file"
                ref={fileRef}
                hidden
                onChange={handleFileSelection}
                />
                +Tuo kasvokuva
            </button>

            <label>{SONG}</label>
            <select
                value={songName}
                className="karaoke-form-dropdown" 
                onChange={(e) => setSongName(e.target.value)}
            >
                <option value="DEFAULT" disabled>Valitse alta</option>
                <option value="Pate">Mä elän vieläkin</option>
                <option value="Paula">Aikuinen nainen</option>
                <option value="Vesku">Tuomittuna kulkemaan</option>
            </select>

            <label>Sävellaji*</label>
            <div className="selection-buttons">
                <input 
                    type="button" 
                    value="-2" 
                    className={getButtonClassName("-2")}
                    onClick={() => handleKeySelection("-2")}
                />
                <input 
                    type="button" 
                    value="-1"
                    className={getButtonClassName("-1")}
                    onClick={() => handleKeySelection("-1")}
                />
                <input 
                    type="button" 
                    value="0" 
                    className={getButtonClassName("0")}
                    onClick={() => handleKeySelection("0")}
                />
                <input 
                    type="button" 
                    value="+1" 
                    className={getButtonClassName("+1")}
                    onClick={() => handleKeySelection("+1")}
                />
                <input 
                    type="button" 
                    value="+2" 
                    className={getButtonClassName("+2")}
                    onClick={() => handleKeySelection("+2")}
                />
            </div>

            <div className="form-checkbox">
                <input type="checkbox" id="save_permission" name="permission" />
                <label htmlFor="save_permission">{PERMISSION_TEXT}</label>
            </div>

                <button onClick={handleButtonClick} className="form-submit-button">
                    {showLoader ? <Loader /> : "Ilmoittaudu"}
                </button>
                {allFieldsValid ? 
                    null:
                    (<Notification message={"All required fields (*) not checked"} />)}
        </div>
    )
}
