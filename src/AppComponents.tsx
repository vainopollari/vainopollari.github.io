import { ChangeEvent, useCallback, useRef, useState } from 'react';
import './App.css'

const NAME_OR_ID_LABEL = "Nimi tai nimimerkki*";
const SONG_SELECTION_LABEL = "Biisi*"
const IMAGE_LABEL = "Kasvokuva"
const IMAGE_SELECTION_TEXT = "+Tuo kasvokuva";
const KEYOTE_LABEL = "Sävellaji*";
const PERMISSION_TEXT = "Sallin tietojeni tallennuksen karaokejärjestelmään";

const SIGNUP_TEXT = "Ilmoittaudu";
const SAVE_FAIL = "Ilmoittautuminen epäonnistui, täytä kaikki vaaditut kentät";

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


export const KaraokeForm: React.FC = () => {
    const [name, setName] = useState<string>("")
    const [songName, setSongName] = useState<string>("DEFAULT")
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | undefined | null>();
    const [showLoader, setShowLoader] = useState(false);
    const [allFieldsValid, setAllFieldsValid] = useState<boolean>(true);

    const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        if (selectedFile?.type === "image/png" || selectedFile?.type === "image/jpeg") {
            setFile(selectedFile);
        }
    };
    
    const handleButtonClick = useCallback(() => {
        const checkBoxElement = document.getElementById("save_permission") as HTMLInputElement;
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
                checkBoxElement.checked = false;
                if (file !== null) {
                    setFile(null);
                }
            }, 2000);
        }
    }, [name, songName, selectedKey, file])

    const handleKeySelection = useCallback((value: string) => {
        setSelectedKey((prev) => (prev === value ? null : value));
      }, []);

    const getSelectionButtonClassName = (value: string) => {
        return `selection-button ${selectedKey === value ? 'selected' : ''}`;
    };
    
    return (
        <div className="karaoke-form">
            <label>{NAME_OR_ID_LABEL}</label>
            <input
                type="text"
                id="personName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="karaoke-form-name-input"
            />

            <label>{IMAGE_LABEL}</label>
            <button onClick={() => fileRef.current?.click()} className="image-selection">
                <input
                id="upload"
                name="upload"
                type="file"
                ref={fileRef}
                hidden
                onChange={handleFileSelection}
                />
                {IMAGE_SELECTION_TEXT}
            </button>

            <label>{SONG_SELECTION_LABEL}</label>
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

            <label>{KEYOTE_LABEL}</label>
            <div className="selection-buttons">
                <input 
                    type="button" 
                    value="-2" 
                    className={getSelectionButtonClassName("-2")}
                    onClick={() => handleKeySelection("-2")}
                />
                <input 
                    type="button" 
                    value="-1"
                    className={getSelectionButtonClassName("-1")}
                    onClick={() => handleKeySelection("-1")}
                />
                <input 
                    type="button" 
                    value="0" 
                    className={getSelectionButtonClassName("0")}
                    onClick={() => handleKeySelection("0")}
                />
                <input 
                    type="button" 
                    value="+1" 
                    className={getSelectionButtonClassName("+1")}
                    onClick={() => handleKeySelection("+1")}
                />
                <input 
                    type="button" 
                    value="+2" 
                    className={getSelectionButtonClassName("+2")}
                    onClick={() => handleKeySelection("+2")}
                />
            </div>

            <div className="form-checkbox">
                <input type="checkbox" id="save_permission" name="permission" />
                <label>{PERMISSION_TEXT}</label>
            </div>

                <button onClick={handleButtonClick} className="form-submit-button">
                    {showLoader ? <Loader /> : SIGNUP_TEXT}
                </button>
                {allFieldsValid ? 
                    null:
                    (<Notification message={SAVE_FAIL} />)}
        </div>
    )
}
