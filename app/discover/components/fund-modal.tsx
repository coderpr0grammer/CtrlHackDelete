'use client'
import { useICP } from "@/app/infrastructure/ICP/ICPContext"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PersonStanding } from "lucide-react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"


const FundModal = ({ }) => {

  const { fundModalOpen, setFundModalOpen, selectedProject, } = useICP()


  const formSchema = z.object({
    amount: z.coerce.number({
      message: "Please enter an amount",
    }).min(1, {
      message: "Amount must be greater than 0",
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)

    
  }

  const progress = selectedProject ? (selectedProject.current_amount / selectedProject.goal_amount) * 100 : 0;

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }
  

  return (
    <Dialog open={fundModalOpen} onOpenChange={setFundModalOpen}>

      <DialogContent className="p-0 border-none overflow-hidden gap-0">
        {/* <DialogHeader > */}
        <div>
          <div
            className={`relative aspect-[16/9] w-full overflow-hidden  ${selectedProject?.image_url ? "" : "bg-gradient-to-b from-indigo-500 to-purple-700"
              }`}
            style={{
              backgroundImage: selectedProject?.image_url ? `url(${selectedProject.image_url})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {selectedProject?.image_url && (
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-black/80"></div>
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-3">
              <div className="p-3 bg-primary rounded-lg">
                <PersonStanding className="h-5 w-5 text-white shrink-0" />
              </div>
              <div className="flex flex-col justify-end">
                <span className="font-normal uppercase text-xs text-muted/50 flex items-center gap-1">
                  Fund a project
                </span>
                <DialogTitle className="text-white text-lg font-bold">
                  {selectedProject?.title}
                </DialogTitle>
              </div>
            </div>
          </div>
        </div>

        
        <div className="p-4 bg-secondary/10">

          <DialogDescription className="">
                {selectedProject?.description}
              </DialogDescription>


        <div className=" mt-6 bg-muted p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium">
                  ${selectedProject?.current_amount.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-xs">
                  of ${selectedProject?.goal_amount.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{Math.round(progress)}% funded</span>
                  <span>•</span>
                  <span>by {selectedProject?.creator}</span>
                </div>
                
                <span>{selectedProject?.end_date ? formatDate(selectedProject?.end_date) : 'No end date'}</span>
              </div>
            </div>
          </div>


          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
            
              {/* </DialogHeader> */}
              <div className="grid gap-4 py-4">

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount to fund</FormLabel>
                      <FormControl>
                        <Input placeholder="Amount in ICP" {...field} />
                      </FormControl>
                      {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <Button type="submit">Submit</Button> */}

              </div>
              <DialogFooter>
                <Button type="submit">Send Funds</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default FundModal;
