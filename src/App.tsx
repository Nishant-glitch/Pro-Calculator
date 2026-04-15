import { useState, useCallback, useEffect } from "react";

type ButtonType = "number" | "operator" | "equals" | "clear" | "special";

interface CalcButton {
  label: string;
  value: string;
  type: ButtonType;
  span?: number;
}

const buttons: CalcButton[] = [
  { label: "AC", value: "AC", type: "clear" },
  { label: "+/-", value: "+/-", type: "special" },
  { label: "%", value: "%", type: "special" },
  { label: "÷", value: "/", type: "operator" },

  { label: "7", value: "7", type: "number" },
  { label: "8", value: "8", type: "number" },
  { label: "9", value: "9", type: "number" },
  { label: "×", value: "*", type: "operator" },

  { label: "4", value: "4", type: "number" },
  { label: "5", value: "5", type: "number" },
  { label: "6", value: "6", type: "number" },
  { label: "−", value: "-", type: "operator" },

  { label: "1", value: "1", type: "number" },
  { label: "2", value: "2", type: "number" },
  { label: "3", value: "3", type: "number" },
  { label: "+", value: "+", type: "operator" },

  { label: "0", value: "0", type: "number", span: 2 },
  { label: ".", value: ".", type: "number" },
  { label: "=", value: "=", type: "equals" },
];

function formatNumber(num: string): string {
  if (num === "Error") return "Error";
  const parsed = parseFloat(num);
  if (isNaN(parsed)) return "0";
  if (Math.abs(parsed) > 1e12 || (Math.abs(parsed) < 1e-6 && parsed !== 0)) {
    return parsed.toExponential(4);
  }
  const parts = num.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}



function getOperatorSymbol(op: string): string {
  switch (op) {
    case "+": return "+";
    case "-": return "−";
    case "*": return "×";
    case "/": return "÷";
    default: return op;
  }
}

export default function App() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [firstOperand, setFirstOperand] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const calculate = useCallback(
    (a: string, op: string, b: string): string => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      let result: number;
      switch (op) {
        case "+": result = numA + numB; break;
        case "-": result = numA - numB; break;
        case "*": result = numA * numB; break;
        case "/":
          if (numB === 0) return "Error";
          result = numA / numB;
          break;
        default: return b;
      }
      return parseFloat(result.toPrecision(12)).toString();
    },
    []
  );

  const handleButton = useCallback(
    (value: string) => {
      setActiveBtn(value);
      setTimeout(() => setActiveBtn(null), 150);

      if (value === "AC") {
        setDisplay("0");
        setExpression("");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecond(false);
        setJustCalculated(false);
        return;
      }

      if (value === "+/-") {
        setDisplay((prev) => {
          const num = parseFloat(prev);
          if (isNaN(num) || num === 0) return prev;
          return (num * -1).toString();
        });
        return;
      }

      if (value === "%") {
        setDisplay((prev) => {
          const num = parseFloat(prev);
          if (isNaN(num)) return prev;
          return (num / 100).toString();
        });
        return;
      }

      if (["+", "-", "*", "/"].includes(value)) {
        if (firstOperand !== null && operator && !waitingForSecond) {
          const result = calculate(firstOperand, operator, display);
          setDisplay(result);
          setFirstOperand(result);
          setExpression(`${result} ${getOperatorSymbol(value)}`);
        } else {
          setFirstOperand(display);
          setExpression(`${display} ${getOperatorSymbol(value)}`);
        }
        setOperator(value);
        setWaitingForSecond(true);
        setJustCalculated(false);
        return;
      }

      if (value === "=") {
        if (firstOperand !== null && operator) {
          const result = calculate(firstOperand, operator, display);
          const historyEntry = `${firstOperand} ${getOperatorSymbol(operator)} ${display} = ${result}`;
          setHistory((prev) => [historyEntry, ...prev.slice(0, 9)]);
          setExpression(`${firstOperand} ${getOperatorSymbol(operator)} ${display} =`);
          setDisplay(result);
          setFirstOperand(null);
          setOperator(null);
          setWaitingForSecond(false);
          setJustCalculated(true);
        }
        return;
      }

      if (value === ".") {
        if (waitingForSecond) {
          setDisplay("0.");
          setWaitingForSecond(false);
          return;
        }
        if (display.includes(".")) return;
        setDisplay((prev) => prev + ".");
        setJustCalculated(false);
        return;
      }

      if (waitingForSecond || justCalculated) {
        setDisplay(value);
        setWaitingForSecond(false);
        setJustCalculated(false);
      } else {
        setDisplay((prev) => {
          if (prev === "0") return value;
          if (prev === "Error") return value;
          if (prev.replace("-", "").replace(".", "").length >= 12) return prev;
          return prev + value;
        });
      }
    },
    [display, firstOperand, operator, waitingForSecond, justCalculated, calculate]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleButton(e.key);
      else if (e.key === "+") handleButton("+");
      else if (e.key === "-") handleButton("-");
      else if (e.key === "*") handleButton("*");
      else if (e.key === "/") { e.preventDefault(); handleButton("/"); }
      else if (e.key === "Enter" || e.key === "=") handleButton("=");
      else if (e.key === "Backspace") {
        setDisplay((prev) => {
          if (prev.length <= 1 || prev === "Error") return "0";
          return prev.slice(0, -1);
        });
      }
      else if (e.key === "Escape") handleButton("AC");
      else if (e.key === ".") handleButton(".");
      else if (e.key === "%") handleButton("%");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleButton]);

  const formattedDisplay = formatNumber(display);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      }}
    >
      {/* Animated background blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "-8rem",
            left: "-8rem",
            width: "24rem",
            height: "24rem",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-8rem",
            right: "-8rem",
            width: "24rem",
            height: "24rem",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "20rem",
            height: "20rem",
            borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 style={{ color: "white", fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.05em" }}>
            Pro Calculator
          </h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            title="Calculation History"
            style={{
              marginLeft: "0.5rem",
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "0.75rem",
              background: showHistory ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(200,200,200,0.9)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div
            style={{
              width: "20rem",
              background: "rgba(10,10,20,0.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1.5rem",
              padding: "1rem",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ color: "white", fontWeight: 600, fontSize: "0.875rem" }}>📋 History</span>
              <button
                onClick={() => setHistory([])}
                style={{ color: "#f87171", fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer" }}
              >
                Clear All
              </button>
            </div>
            {history.length === 0 ? (
              <p style={{ color: "rgba(150,150,170,0.7)", fontSize: "0.875rem", textAlign: "center", padding: "1rem 0" }}>
                No history yet
              </p>
            ) : (
              <div style={{ maxHeight: "12rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {history.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      color: "rgba(200,200,220,0.9)",
                      fontSize: "0.8rem",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "0.75rem",
                      padding: "0.5rem 0.75rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calculator Body */}
        <div
          style={{
            width: "20rem",
            background: "rgba(15,12,40,0.85)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "2rem",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Display */}
          <div
            style={{
              padding: "1.5rem 1.5rem 1rem",
              minHeight: "8rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              background: "linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%)",
              position: "relative",
            }}
          >
            {/* Expression */}
            <div
              style={{
                color: "rgba(150,140,200,0.7)",
                fontSize: "0.8rem",
                fontFamily: "monospace",
                height: "1.2rem",
                marginBottom: "0.25rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              {expression || ""}
            </div>

            {/* Main Number */}
            <div
              style={{
                color: display === "Error" ? "#f87171" : "white",
                fontFamily: "monospace",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                wordBreak: "break-all",
                textAlign: "right",
                transition: "font-size 0.15s",
                fontSize:
                  formattedDisplay.replace(/,/g, "").length > 14
                    ? "1.5rem"
                    : formattedDisplay.replace(/,/g, "").length > 10
                    ? "2rem"
                    : formattedDisplay.replace(/,/g, "").length > 7
                    ? "2.5rem"
                    : "3rem",
              }}
            >
              {formattedDisplay}
            </div>

            {/* Operator indicator */}
            {operator && (
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  background: "rgba(251,146,60,0.2)",
                  border: "1px solid rgba(251,146,60,0.3)",
                  borderRadius: "0.5rem",
                  padding: "0.1rem 0.5rem",
                  color: "#fb923c",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {getOperatorSymbol(operator)}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", margin: "0 1rem" }} />

          {/* Buttons */}
          <div
            style={{
              padding: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.65rem",
            }}
          >
            {buttons.map((btn, index) => {
              const isActive = activeBtn === btn.value;
              let bgColor = "";
              let textColor = "white";
              let shadow = "";

              if (btn.type === "clear" || btn.type === "special") {
                bgColor = isActive ? "rgba(120,120,140,0.9)" : "rgba(80,80,100,0.7)";
                shadow = "0 4px 12px rgba(0,0,0,0.3)";
              } else if (btn.type === "operator") {
                bgColor = isActive ? "rgba(245,130,40,0.9)" : "rgba(251,146,60,0.85)";
                shadow = "0 4px 15px rgba(251,146,60,0.3)";
              } else if (btn.type === "equals") {
                bgColor = isActive ? "rgba(100,80,220,0.9)" : "linear-gradient(135deg, #8b5cf6, #3b82f6)";
                shadow = "0 4px 20px rgba(139,92,246,0.4)";
              } else {
                bgColor = isActive ? "rgba(80,80,110,0.9)" : "rgba(50,50,80,0.7)";
                shadow = "0 4px 12px rgba(0,0,0,0.3)";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleButton(btn.value)}
                  style={{
                    gridColumn: btn.span === 2 ? "span 2" : "span 1",
                    height: "3.75rem",
                    borderRadius: "1rem",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: textColor,
                    background: btn.type === "equals" && !isActive
                      ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
                      : bgColor,
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: shadow,
                    cursor: "pointer",
                    transform: isActive ? "scale(0.93)" : "scale(1)",
                    transition: "transform 0.1s, background 0.15s, box-shadow 0.15s",
                    outline: "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Shine overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                      borderRadius: "1rem",
                      pointerEvents: "none",
                    }}
                  />
                  <span style={{ position: "relative", zIndex: 1 }}>{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ paddingBottom: "1rem", textAlign: "center" }}>
            <p style={{ color: "rgba(100,100,130,0.6)", fontSize: "0.7rem" }}>
              ⌨️ Keyboard supported • ESC to reset
            </p>
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", maxWidth: "20rem" }}>
          {["0-9", "+", "−", "×", "÷", "Enter/=", "Esc", "⌫"].map((key) => (
            <span
              key={key}
              style={{
                fontSize: "0.65rem",
                color: "rgba(130,120,170,0.7)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "0.4rem",
                padding: "0.15rem 0.4rem",
                fontFamily: "monospace",
              }}
            >
              {key}
            </span>
          ))}
        </div>

        {/* Brand footer */}
        <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
          <p style={{ color: "rgba(139,92,246,0.5)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
            BUILT WITH REACT + TAILWIND
          </p>
        </div>
      </div>
    </div>
  );
}
