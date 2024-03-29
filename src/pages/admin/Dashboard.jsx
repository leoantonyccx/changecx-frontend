import React, { useState } from "react";
import "./Dashboard.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllEmployees } from "../../graphql/query/useGetAllEmployees";
import { useGetAllSkills } from "../../graphql/query/useGetAllSkills";
import { useGetAllCategories } from "../../graphql/query/useGetAllCategories";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import ReactApexChart from "react-apexcharts";
import {
  getCategories,
  getCertificates,
  getEmployees,
  getSkills,
} from "../../redux/slices/adminSlice";
import loader from "../../assets/loader.svg";
import { useGetAllCertificates } from "../../graphql/query/useGetAllCertificates";
import { useSyncEmployeesData } from "../../graphql/mutation/useLogin";
import { useGetLastSync } from "../../graphql/query/useGetEmployee";
import { format } from "date-fns";
import iSkillOR from "../../assets/iSkillOR.png";
import iSkillR from "../../assets/iSkillR.png";
import iCatOR from "../../assets/iCatOR.png";
import iCatR from "../../assets/iCatR.png";
import iCertR from "../../assets/iCertR.png";
import iEmpsR from "../../assets/iEmpsR.png";
import iForR from "../../assets/iForR.png";

function Dashboard() {
  const admin = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [load, setLoading] = useState(false);
  const { loading: gettingEmployees, employees = [] } = useGetAllEmployees();
  const { loading: gettingSkills, skills = [] } = useGetAllSkills();
  const { loading: gettingCategories, categories = [] } = useGetAllCategories();
  const { loading: gettingCertificates, certificates = [] } =
    useGetAllCertificates();
  const {
    syncEmployeesData,
    loading: syncing,
    error: syncError,
  } = useSyncEmployeesData();
  const {
    getLastSync,
    loading: gettingLastSync,
    data: lastSync = "",
  } = useGetLastSync();

  useEffect(() => {
    if (admin.categories.length === 0) {
      dispatch(getCategories(categories));
    }
    if (admin.skills.length === 0) {
      dispatch(getSkills(skills));
    }
    if (admin.employees.length === 0) {
      dispatch(getEmployees(employees));
    }
    if (admin.certificates.length === 0) {
      dispatch(getCertificates(certificates));
    }
    console.log("done", admin);
  }, [gettingCategories, getEmployees, gettingSkills, gettingCertificates]);

  useEffect(() => {
    getLastSync();
  }, []);

  const sync = async () => {
    let { data } = await syncEmployeesData();
    if (data?.syncEmployeesData?.length !== 0) {
      let { data: ls } = await getLastSync();
      console.log(ls);
      dispatch(getEmployees(data?.syncEmployeesData));
    }
    if (syncError) {
      console.log("Sync Failed", syncError);
    }
    setLoading(false);
  };

  const getDate = (date) => {
    let dateObj = format(new Date(date), "d MMM yyyy -- HH:mm:ss");
    console.log(dateObj);
    return dateObj.toString();
  };

  const chartData = {
    series: [
      {
        name: "Skills",
        data: [...categories?.slice(0, 5)?.map((c) => c?.skills?.length)],
      },
    ],
    options: {
      chart: {
        type: "area",
        zoom: {
          enabled: true,
        },
      },
      background: "white",

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Categories on Skills",
        align: "left",
        margin: 10,
        offsetX: 4,
        offsetY: 6,
        style: {
          fontSize: "10px",
          color: "red",
          fontWeight: "normal",
        },
      },
      colors: ["#ff8888", "#ffb6b6", "red", "transparent"],
      grid: {
        show: false,
        row: {
          opacity: 0,
        },
      },
      xaxis: {
        categories: [...categories?.slice(0, 5)?.map((c) => c?.name)],
        labels: {
          show: true,
          hideOverlappingLabels: true,
        },
      },
      yaxis: {
        min: 1,
        forceNiceScale: true,
        tickAmount: 2,
      },
    },
  };

  const chartData2 = {
    series: [
      {
        name: "Employees",
        data: [
          ...skills
            ?.slice(0, 5)
            ?.map((s, index) => index < 5 && s?.employeeSkills?.length),
        ],
      },
    ],
    options: {
      chart: {
        type: "area",
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Skills on Employees",
        align: "left",
        margin: 10,
        offsetX: 4,
        offsetY: 6,
        style: {
          fontSize: "10px",
          color: "red",
          fontWeight: "normal",
        },
      },
      colors: ["#ff8888", "#ffb6b6", "red", "transparent"],
      grid: {
        show: false,
        row: {
          opacity: 0,
        },
      },
      xaxis: {
        categories: [...skills?.slice(0, 5)?.map((s) => s?.skill?.name)],
        labels: {
          show: true,
          hideOverlappingLabels: true,
        },
      },
      yaxis: {
        labels: {
          hideOverlappingLabels: true,
        },
      },
    },
  };

  return (
    <>
      {gettingEmployees |
      gettingCategories |
      gettingSkills |
      gettingCertificates |
      gettingLastSync ? (
        <div
          style={{
            display: "grid",
            placeContent: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <img src={loader} alt="" />
        </div>
      ) : (
        <div className="dashboard">
          <div className="d-mixed">
            <div className="dm-cont">
              <div>
                <div className="dmc-img">
                  <span></span>
                  <img src={iEmpsR} alt="" />
                </div>
                <div>
                  <p>Employees</p>
                  <span className="gt">{employees.length}</span>
                </div>
                <Link to={"/admin/employee"}>
                  <img src={iForR} alt="" />
                </Link>
              </div>
              <div>
                <div className="dmc-img">
                  <span></span>
                  <img src={iCatR} alt="" />
                </div>
                <div>
                  <p>Categories</p>
                  <span className="gt">{categories.length}</span>
                </div>
                <Link to={"/admin/category"}>
                  <img src={iForR} alt="" />
                </Link>
              </div>
              <div>
                <div className="dmc-img">
                  <span></span>
                  <img src={iSkillR} alt="" />
                </div>
                <div>
                  <p>Skills</p>
                  <span className="gt">{skills.length}</span>
                </div>
                <Link to={"/admin/skill"}>
                  <img src={iForR} alt="" />
                </Link>
              </div>
              <div>
                <div className="dmc-img">
                  <span></span>
                  <img src={iCertR} alt="" />
                </div>
                <div>
                  <p>Certificates</p>
                  <span className="gt">{certificates.length}</span>
                </div>
                <Link to={"/admin/certificate"}>
                  <img src={iForR} alt="" />
                </Link>
              </div>
            </div>
          </div>

          <div className="d-cats">
            <div className="d-title">
              <p>Skills</p>
              <span></span>
              <img
                onClick={() => navigate("/admin/skill")}
                src={iForR}
                alt=""
              />
            </div>
            <p style={{ marginTop: "40px", marginLeft: "20px", color: "red" }}>
              Skills on Employees
            </p>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div className="dc-cont">
                {skills ? (
                  skills.map(
                    (s, index) =>
                      index < 5 && (
                        <div key={s?.id} className="sk-body">
                          <img src={iSkillOR} alt="" />
                          <div className="sb-cont">
                            <p>{s?.skill?.name}</p>
                            <span>
                              <h6></h6>
                              {s?.category.name}
                            </span>
                          </div>
                          <div className="dc-count">
                            <h6>emp</h6>
                            <span>{s?.employeeSkills?.length}</span>
                          </div>
                        </div>
                      )
                  )
                ) : (
                  <div></div>
                )}
              </div>
              <div className="chart">
                <ReactApexChart
                  width={"100%"}
                  options={chartData2.options}
                  series={chartData2.series}
                  type="area"
                />
              </div>
            </div>
          </div>

          <div className="d-cats">
            <div className="d-title">
              <p>Categories</p>
              <span></span>
              <img
                onClick={() => navigate("/admin/category")}
                src={iForR}
                alt=""
              />
            </div>
            <p style={{ marginTop: "40px", marginLeft: "20px", color: "red" }}>
              Categories on Skills
            </p>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div className="contents dc-cont">
                {categories ? (
                  categories.map(
                    (c, index) =>
                      index < 5 && (
                        <div key={c?.id}>
                          <img src={iCatOR} alt="" />
                          <p>{c?.name}</p>
                          <div className="dc-count">
                            <h6>skills</h6>
                            <span>{c?.skills?.length}</span>
                          </div>
                        </div>
                      )
                  )
                ) : (
                  <div></div>
                )}
              </div>
              <div className="chart">
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  type="area"
                  width={"100%"}
                  height={150}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <Nav />
    </>
  );
}

export default Dashboard;
