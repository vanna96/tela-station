import { Backdrop, Box, CircularProgress, circularProgressClasses } from "@mui/material";
import { green } from "@mui/material/colors";





const BackDrop = (props: any) => {
  
  return (
<Backdrop
      sx={{
        color: "#fff",
        backgroundColor: "rgb(0 0 0/20%)",
        backdropFilter: "blur(7px)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      // open={state.isSubmitting}
      open={props?.open}
    >
      <div className="flex gap-2 flex-col shadow-sm shadow-green-100 justify-center items-center bg-white px-3 py-5 rounded-2xl">
        <Box sx={{ position: "relative" }}>
          <CircularProgress
            variant="determinate"
            sx={{
              color: (theme) =>
                theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
            }}
            size={50}
            thickness={10}
            value={100}
          />
          <CircularProgress
            color="success"
            variant="indeterminate"
            disableShrink
            sx={{
              animationDuration: "900ms",
              position: "absolute",
              left: 0,
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: "round",
                color: green[200],
              },
            }}
            size={50}
            thickness={10}
          />
        </Box>
        <span className="text-[14px] ml-3 text-gray-500 font-bold">
          Loading ...
        </span>
      </div>
    </Backdrop>
  )
    
}
export default BackDrop