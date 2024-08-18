import {useState, useEffect} from "react";
import {ethers} from "ethers";
import grading_abi from "../artifacts/contracts/Grading.sol/Grading.json";

export default function HomePage() {
    const [ethWallet, setEthWallet] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [grade, setGrade] = useState(undefined);
    const [students, setStudents] = useState([]);
    const [entries, setEntries] = useState(0);
    const [rollNo, setRollNo] = useState(undefined);
    const [calcM, setCalc] = useState(undefined);
    const [csM, setCS] = useState(undefined);
    const [langM, setLang] = useState(undefined);
    const [histM, setHist] = useState(undefined);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const gradeABI = grading_abi.abi;

    const getWallet = async() => {
        if (window.ethereum) {
          setEthWallet(window.ethereum);
        }
    
        if (ethWallet) {
          const account = await ethWallet.request({method: "eth_accounts"});
          handleAccount(account);
        }
    }

    const handleAccount = (account) => {
        if (account) {
          console.log ("Admin connected: ", account);
          setAccount(account);
        }
        else {
          console.log("No account found");
        }
    }

    const connectAccount = async() => {
        if (!ethWallet) {
          alert('MetaMask wallet is required to connect');
          return;
        }
      
        const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
        handleAccount(accounts[0]);
        
        // once wallet is set we can get a reference to our deployed contract
        getGradeContract();
    };

    const getGradeContract = () => {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const signer = provider.getSigner();
        const gradeContract = new ethers.Contract(contractAddress, gradeABI, signer);
     
        setGrade(gradeContract);
    }

    const getStudentMarksArray = async() => {
      if(grade) {
        const studentArr = await grade.getStudentMarks();
        const formattedStudents = studentArr.map(student => ({
          rollNo: student.rollNo.toNumber(),
          calcMarks: student.calcMarks.toNumber(),
          cSMarks: student.cSMarks.toNumber(),
          languageMarks: student.languageMarks.toNumber(),
          historyMarks: student.historyMarks.toNumber()
        }));
        formattedStudents.sort((a,b) => a.rollNo - b.rollNo);

        setStudents((formattedStudents));
      }
    }

    const getStudentEntries = async() => {
      if(grade) {
        setEntries((await grade.getEntries()).toNumber());
      }
    }

    const addEntry = async() => {
      if(grade) {
        let tx = await grade.addStudentMarks(rollNo, calcM, csM, langM, histM);
        await tx.wait();
        await getStudentMarksArray();
        getStudentEntries();
      }
    }

    const removeEntry = async() => {
      if(grade) {
        let tx = await grade.removeStudentEntry(rollNo);
        await tx.wait();
        await getStudentMarksArray();
        getStudentEntries();
      }
    }

    const getClassforMarks = (marks) => {
      return marks >= 35 ? "pass" : "fail";
    }

    const initUser = () => {
        // Check to see if user has Metamask
        if (!ethWallet) {
          return <p>Please install Metamask in order to shop here.</p>
        }
    
        // Check to see if user is connected. If not, connect to their account
        if (!account) {
          return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
        }
    
        if (students.length == 0) {
          getStudentMarksArray();
          getStudentEntries();
        }
    
        return (
          <div>
            <input
                  type="number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="Enter Roll No.">

            </input>
            <input
                  type="number"
                  value={calcM}
                  onChange={(e) => setCalc(e.target.value)}
                  placeholder="Enter Calculus Marks.">

            </input>
            <input
                  type="number"
                  value={csM}
                  onChange={(e) => setCS(e.target.value)}
                  placeholder="Enter CS Marks.">

            </input>
            <input
                  type="number"
                  value={langM}
                  onChange={(e) => setLang(e.target.value)}
                  placeholder="Enter Language Marks.">

            </input>
            <input
                  type="number"
                  value={histM}
                  onChange={(e) => setHist(e.target.value)}
                  placeholder="Enter History Marks.">

            </input>

            <button onClick={addEntry}>Add Entry</button>

            <input
                  type="number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="Enter Roll No.">

            </input>

            <button onClick={removeEntry}>Remove Entry</button>
            <p>Total student entries: {entries}</p>
          </div>
        )
    }

    useEffect(() => {getWallet();}, []);

    return (
        <main className="container">
          <header><h1>Welcome Admin!</h1></header>
          {initUser()}
          <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Calc Marks</th>
                  <th>CS Marks</th>
                  <th>Language Marks</th>
                  <th>History Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td>{student.rollNo}</td>
                    <td className={getClassforMarks(student.calcMarks)}>{student.calcMarks}</td>
                    <td className={getClassforMarks(student.cSMarks)}>{student.cSMarks}</td>
                    <td className={getClassforMarks(student.languageMarks)}>{student.languageMarks}</td>
                    <td className={getClassforMarks(student.historyMarks)}>{student.historyMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          <style jsx>{`
            .container {
              text-align: center;
            }
            table {
              width: 80%;
              margin: 20px auto;
              border-collapse: collapse;
            }
            th, td {
              padding: 10px 15px;
              text-align: center;
              border: 1px solid #ddd;
            }
            th {
              background-color: #f4f4f4;
            }
            .pass {
              background-color: lightgreen;
            }
            .fail {
              background-color: salmon;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
          `}
          </style>
        </main>
      )

}